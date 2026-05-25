import { Device } from '../types/index';
import { IPCalculator, NetworkAnalyzer } from '../utils/ipUtils';
import { CascadingChange } from '../types/index';

/**
 * Cascading Engine - Detects cascading changes when IP changes
 * THE KILLER FEATURE
 */
export class CascadingEngine {
  /**
   * Detect all cascading changes when one IP changes
   */
  static detectCascadingChanges(
    devices: Device[],
    modifiedDevice: string,
    modifiedPort: string,
    newIP: string
  ): CascadingChange[] {
    const changes: CascadingChange[] = [];

    // Find the current device and port
    const device = NetworkAnalyzer.findDeviceByHostname(devices, modifiedDevice);
    if (!device || !device.ports[modifiedPort]) {
      return [];
    }

    const port = device.ports[modifiedPort];
    const oldIP = port.ip;
    const oldSubnet = port.subnet;
    const newSubnet = IPCalculator.calculateSubnet(newIP, port.cidr);

    // Type 1: If subnet changed, find devices in old subnet that need updating
    if (oldSubnet !== newSubnet) {
      const devicesInOldSubnet = NetworkAnalyzer.findDevicesInSubnet(
        devices,
        oldSubnet,
        port.cidr
      ).filter((d) => d.hostname !== modifiedDevice);

      for (const affectedDevice of devicesInOldSubnet) {
        for (const [affPortId, affPort] of Object.entries(affectedDevice.ports)) {
          if (affPort.subnet === oldSubnet && affPort.connected_to === `${modifiedDevice}.${modifiedPort}`) {
            const newAffectedIP = this.recalculateIP(newSubnet, affPort.cidr);
            changes.push({
              device: affectedDevice.hostname,
              port: affPortId,
              oldValue: affPort.ip,
              newValue: newAffectedIP,
              reason: `Connected device ${modifiedDevice}.${modifiedPort} subnet changed`,
              affectedBy: `${modifiedDevice}.${modifiedPort}`,
            });
          }
        }
      }
    }

    // Type 2: If this port is a gateway, find all clients using it
    if (device.role === 'router') {
      const clientsUsingAsGateway = this.findClientsWithGateway(devices, oldIP);

      for (const clientDevice of clientsUsingAsGateway) {
        for (const [clientPortId, clientPort] of Object.entries(clientDevice.ports)) {
          if (clientPort.ip && clientPort.enabled) {
            // Calculate new IP for client in new subnet
            const clientParts = clientPort.ip.split('.').map(Number);
            const newClientIP = `${newSubnet.split('.').slice(0, 3).join('.')}.${clientParts[3]}`;

            changes.push({
              device: clientDevice.hostname,
              port: clientPortId,
              oldValue: clientPort.ip,
              newValue: newClientIP,
              reason: `Gateway ${oldIP} → ${newIP} (subnet changed)`,
              affectedBy: `${modifiedDevice}.${modifiedPort}`,
            });
          }
        }
      }
    }

    // Type 3: If this is a router-to-router link and OSPF is enabled
    if (device.role === 'router' && port.ospf_area !== undefined) {
      const connectedDevice = NetworkAnalyzer.findConnectedDevice(devices, port.connected_to || '');

      if (connectedDevice?.device.role === 'router') {
        // Check if wildcard needs updating
        const newWildcard = IPCalculator.cidrToWildcard(port.cidr);
        if (port.wildcard !== newWildcard) {
          changes.push({
            device: modifiedDevice,
            port: modifiedPort,
            oldValue: port.wildcard,
            newValue: newWildcard,
            reason: `OSPF wildcard auto-correction for CIDR /${port.cidr}`,
            affectedBy: 'auto-correction',
          });
        }
      }
    }

    return changes;
  }

  /**
   * Apply cascading changes atomically
   */
  static applyCascadingChanges(
    devices: Device[],
    changes: CascadingChange[]
  ): { success: boolean; updatedDevices: Device[]; errors: string[] } {
    try {
      // Deep copy to avoid mutation
      const updatedDevices = JSON.parse(JSON.stringify(devices)) as Device[];
      const errors: string[] = [];

      for (const change of changes) {
        const device = updatedDevices.find((d) => d.hostname === change.device);

        if (!device) {
          errors.push(`Device ${change.device} not found`);
          continue;
        }

        const port = device.ports[change.port];
        if (!port) {
          errors.push(`Port ${change.device}.${change.port} not found`);
          continue;
        }

        // Apply the change
        port.ip = change.newValue;

        // Auto-update subnet and wildcard
        port.subnet = IPCalculator.calculateSubnet(change.newValue, port.cidr);
        port.wildcard = IPCalculator.cidrToWildcard(port.cidr);

        device.updated_at = new Date().toISOString();
      }

      return { success: errors.length === 0, updatedDevices, errors };
    } catch (error) {
      return {
        success: false,
        updatedDevices: devices,
        errors: [(error as Error).message],
      };
    }
  }

  /**
   * Rollback changes (undo)
   */
  static rollbackChanges(
    devices: Device[],
    originalDevices: Device[]
  ): Device[] {
    return JSON.parse(JSON.stringify(originalDevices));
  }

  /**
   * Find all clients that use an IP as gateway
   */
  private static findClientsWithGateway(devices: Device[], gatewayIP: string): Device[] {
    const clients: Device[] = [];

    for (const device of devices) {
      if (device.role !== 'client' && device.role !== 'server') continue;

      for (const port of Object.values(device.ports)) {
        if (!port.ip) continue;

        // Extract gateway from subnet
        const subnetParts = port.subnet.split('.').map(Number);
        subnetParts[3] = 1;
        const calculatedGateway = subnetParts.join('.');

        if (calculatedGateway === gatewayIP) {
          clients.push(device);
          break;
        }
      }
    }

    return clients;
  }

  /**
   * Recalculate IP based on new subnet (keep last octet)
   */
  private static recalculateIP(newSubnet: string, cidr: number): string {
    const subnetParts = newSubnet.split('.');
    const hostBits = 32 - cidr;

    if (hostBits <= 0) return newSubnet;

    const baseIP = [...subnetParts.map(Number)];
    baseIP[3] = baseIP[3] + 1; // Next usable host

    return baseIP.join('.');
  }

  /**
   * Get summary of cascading changes
   */
  static getSummary(changes: CascadingChange[]): {
    total_changes: number;
    affected_devices: Set<string>;
    by_reason: Record<string, number>;
  } {
    const affected = new Set(changes.map((c) => c.device));
    const byReason: Record<string, number> = {};

    for (const change of changes) {
      byReason[change.reason] = (byReason[change.reason] || 0) + 1;
    }

    return {
      total_changes: changes.length,
      affected_devices: affected,
      by_reason: byReason,
    };
  }
}

import React from 'react';
import { Device } from '../types';

export function DeviceTable({ devices }: { devices: Device[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Hostname</th>
          <th>Role</th>
          <th>Port</th>
          <th>IP</th>
          <th>CIDR</th>
          <th>Subnet</th>
        </tr>
      </thead>
      <tbody>
        {devices.flatMap(device =>
          Object.entries(device.ports).map(([portId, port]) => (
            <tr key={`${device.hostname}-${portId}`}>
              <td>{device.hostname}</td>
              <td>{device.role}</td>
              <td>{portId}</td>
              <td>{port.ip}</td>
              <td>{port.cidr}</td>
              <td>{port.subnet}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export type DeviceRole = 'router' | 'switch' | 'server' | 'client' | 'accesspoint';

export interface Port {
  id: string;
  ip: string;
  cidr: number;
  subnet: string;
  wildcard: string;
  enabled: boolean;
  description?: string;
  connected_to?: string;
  ospf_area?: number;
}

export interface Device {
  hostname: string;
  role: DeviceRole;
  ports: Record<string, Port>;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ValidationResult {
  valid: boolean;
  rule: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  affected_devices?: string[];
}

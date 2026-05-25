import React, { useState } from 'react';
import { Device } from './types';
import { DeviceTable } from './components/DeviceTable';
import { CLIGeneratorEngine } from './services/engines/CLIGeneratorEngine';

const exampleDevices: Device[] = [
  {
    hostname: 'R1',
    role: 'router',
    ports: {
      'Gi0/0': {
        id: 'Gi0/0', ip: '192.168.1.1', cidr: 24, subnet: '192.168.1.0', wildcard: '0.0.0.255', enabled: true
      },
      'Gi0/1': {
        id: 'Gi0/1', ip: '10.0.0.1', cidr: 30, subnet: '10.0.0.0', wildcard: '0.0.0.3', enabled: true
      }
    },
    description: 'Example router',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    hostname: 'SW1',
    role: 'switch',
    ports: {
      'Gi0/0': {
        id: 'Gi0/0', ip: '192.168.1.2', cidr: 24, subnet: '192.168.1.0', wildcard: '0.0.0.255', enabled: true
      }
    },
    description: 'Example switch',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export function App() {
  const [devices] = useState<Device[]>(exampleDevices);
  const current = devices[0];

  return (
    <div>
      <h1>Network SOT Sandbox</h1>
      <DeviceTable devices={devices} />
      <h2>Cisco CLI for {current.hostname}</h2>
      <pre>{CLIGeneratorEngine.generateIOSConfig(current)}</pre>
    </div>
  );
}
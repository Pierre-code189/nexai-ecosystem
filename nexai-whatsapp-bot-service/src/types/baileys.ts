export type BaileysConnectionState =
  | 'disconnected'
  | 'generating_qr'
  | 'qr_ready'
  | 'pairing_code'
  | 'pairing'
  | 'authenticated'
  | 'connected'
  | 'reconnecting';

export interface BaileysLogEvent {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  payload?: any;
}

export interface BaileysSession {
  tenantId: string;
  status: BaileysConnectionState;
  qrCodeRaw?: string;
  pairingCode?: string;
  phoneNumber?: string;
  connectedName?: string;
  uptimeSeconds?: number;
  batteryLevel?: number;
  isMultiDevice: boolean;
}

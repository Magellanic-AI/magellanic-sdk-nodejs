import { DilithiumMode } from '../../crypto';

export interface AuthData {
  id: string;
  dilithiumPrivateKey: string;
  mode: DilithiumMode;
  publicKey: string;
}

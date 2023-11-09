import { DilithiumMode } from '.';

export interface AuthData {
  id: string;
  dilithiumPrivateKey: string;
  mode: DilithiumMode;
  publicKey: string;
}

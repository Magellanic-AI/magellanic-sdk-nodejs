import { DilithiumMode } from '../../crypto';

export interface AuthData {
  id: string;
  privateKey: string;
  mode: DilithiumMode;
}

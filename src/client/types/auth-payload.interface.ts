import { Provider } from './provider.type';

interface ReauthData {
  message: string;
  signature: string;
}

export interface AuthPayload {
  providerType: Provider;
  name?: string;
  token?: string;
  reauthData?: ReauthData;
}

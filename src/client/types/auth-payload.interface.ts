import { Provider } from './provider.type';

export interface AuthPayload {
  providerType?: Provider;
  apiKey?: string;
  name?: string;
  token?: string;
  projectKey: string;
  type: 'sdk';
}

import { Provider } from './provider.type';

export interface Config {
  providerType?: Provider;
  apiKey?: string;
  name?: string;
  projectKey: string;
  roleKey?: string;
}

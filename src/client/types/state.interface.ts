export interface State {
  tokensSecret: string;
  tokens: Record<string, string>;
  nextRotation: string;
}

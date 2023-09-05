export class AuthenticateError extends Error {
  constructor(message: string, response?: string) {
    super(`${message}${response ? `\nResponse: ${response}` : ''}`);
  }
}

export class AuthenticateError extends Error {
  constructor(message: string, response?: Record<string, unknown>) {
    super(
      `${message}${response ? `\nResponse: ${JSON.stringify(response)}` : ''}`,
    );
  }
}

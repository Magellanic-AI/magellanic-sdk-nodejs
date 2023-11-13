export class UnauthorizedError extends Error {
  constructor(message?: any) {
    super(
      message
        ? typeof message === 'string'
          ? message
          : JSON.stringify(message)
        : 'Unauthorized',
    );
  }
}

export class UnknownError extends Error {
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

export class ForbiddenError extends Error {
  constructor(message?: any) {
    super(
      message
        ? typeof message === 'string'
          ? message
          : JSON.stringify(message)
        : 'Forbidden',
    );
  }
}

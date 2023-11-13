export class BadArgumentError extends Error {
  constructor(message?: any) {
    super(
      message
        ? typeof message === 'string'
          ? message
          : JSON.stringify(message)
        : 'Bad argument',
    );
  }
}

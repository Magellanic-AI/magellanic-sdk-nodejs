export class ForbiddenError extends Error {
  constructor(message?: any) {
    super(message ? JSON.stringify(message) : 'Forbidden');
  }
}

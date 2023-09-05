export class ProjectKeyMissingError extends Error {
  constructor() {
    super(
      'Project key is missing. Provide it either by using a config object or environmental variables. Check the documentation for more details.',
    );
  }
}

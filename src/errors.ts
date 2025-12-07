/**
 * Custom error class for Telegraph API errors
 */
export class TelegraphError extends Error {
  /**
   * Creates a new TelegraphError
   * @param message - Error message
   */
  constructor(message: string) {
    super(message);
    this.name = 'TelegraphError';

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, TelegraphError);
    }
  }
}

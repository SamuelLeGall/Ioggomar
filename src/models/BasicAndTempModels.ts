export type Result<T> = [T, null] | [null, AppError];
export interface ExtendingDrawingLimits {
  criticalFailureLimit?: number;
  marginalFailureLimit?: number;
  marginalSuccessLimit?: number;
  criticalSuccessLimit?: number;
}

export enum drawingResult {
  CRITICAL_FAILURE = "criticalFailure",
  FAILURE = "failure",
  MARGINAL_FAILURE = "marginalFailure",
  MARGINAL_SUCCESS = "marginalSuccess",
  SUCCESS = "success",
  CRITICAL_SUCCESS = "criticalSuccess",
}
export interface OptionConfig {
  key: string;
  value: string;
}

export enum AppErrorCodes {
  ACTION_NOT_ALLOWED_DATA_CONSISTENCY = "ACTION_NOT_ALLOWED_DATA_CONSISTENCY",
  ACTION_NOT_ALLOWED_MISSING_DATA = "ACTION_NOT_ALLOWED_MISSING_DATA",
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  RESOURCE_NOT_FOUND_FOR_THIS_CONTEXT = "RESOURCE_NOT_FOUND_FOR_THIS_CONTEXT",
}
export class AppError extends Error {
  public readonly code: string;

  constructor(message: string, code: AppErrorCodes) {
    super(message);
    this.code = code;

    // This line is to maintain the correct prototype chain when extending built-in classes like Error
    Object.setPrototypeOf(this, new.target.prototype);

    // Optional: Capture the stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

import { questDifficulty } from "@src/models/quests/QuestsModels";

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

// ===== DOMAIN-SPECIFIC ERROR CATEGORIES =====
// This is a key principle: errors should be categorized by domain meaning, not technical implementation

export type TLayer = "Entity" | "Repository" | "Service";

export enum ErrorCategory {
  DOMAIN = "DOMAIN", // Business rule violations
  INFRASTRUCTURE = "INFRASTRUCTURE", // Database, network, external services
  VALIDATION = "VALIDATION", // Input validation failures
  SYSTEM = "SYSTEM", // Unexpected system errors
}

export enum AppErrorCodes {
  // Infrastructure
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  RESOURCE_CONFLICT = "RESOURCE_CONFLICT",
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",

  // Domain/Business
  ACTION_NOT_ALLOWED = "ACTION_NOT_ALLOWED",
  BUSINESS_RULE_VIOLATION = "BUSINESS_RULE_VIOLATION",
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",

  // Validation
  INVALID_INPUT = "INVALID_INPUT",
  MISSING_REQUIRED_DATA = "MISSING_REQUIRED_DATA",

  // System
  UNEXPECTED_ERROR = "UNEXPECTED_ERROR",
  CONFIGURATION_ERROR = "CONFIGURATION_ERROR",
}

// ===== ERROR SEVERITY LEVELS =====
export enum ErrorSeverity {
  LOW = "LOW", // Expected errors (user input, not found)
  MEDIUM = "MEDIUM", // Recoverable infrastructure issues
  HIGH = "HIGH", // System errors, data corruption
  CRITICAL = "CRITICAL", // Security, data loss potential
}

export interface ErrorContext {
  layer: TLayer;
  method: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
  correlationId?: string; // For request tracing
}

// ===== ENHANCED ERROR CLASS =====
export class AppError extends Error {
  public readonly code: AppErrorCodes;
  public readonly category: ErrorCategory;
  public readonly severity: ErrorSeverity;
  public readonly context: ErrorContext;
  public readonly cause?: AppError;
  public readonly errorChain: ErrorContext[];
  public readonly isRecoverable: boolean;
  public readonly userMessage?: string; // Safe message for end users

  constructor(
    message: string,
    code: AppErrorCodes,
    category: ErrorCategory,
    severity: ErrorSeverity,
    context: ErrorContext,
    options: {
      cause?: AppError;
      isRecoverable?: boolean;
      userMessage?: string;
    } = {},
  ) {
    super(message);
    this.code = code;
    this.category = category;
    this.severity = severity;
    this.context = context;
    this.cause = options.cause;
    this.isRecoverable = options.isRecoverable ?? true;
    this.userMessage = options.userMessage;

    this.errorChain = options.cause
      ? [...options.cause.errorChain, context]
      : [context];

    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  getRootCause(): AppError {
    return this.cause ? this.cause.getRootCause() : this;
  }

  getErrorChainString(): string {
    return this.errorChain
      .map(
        (ctx, index) =>
          `${index + 1}. [${ctx.layer}:${ctx.method}] at ${ctx.timestamp.toISOString()}`,
      )
      .join("\n");
  }

  // Safe message for frontend consumption
  getPublicMessage(): string {
    return this.userMessage ?? this.getDefaultUserMessage();
  }

  private getDefaultUserMessage(): string {
    switch (this.category) {
      case ErrorCategory.DOMAIN:
        return "The requested action cannot be completed due to business rules.";
      case ErrorCategory.VALIDATION:
        return "The provided information is invalid.";
      case ErrorCategory.INFRASTRUCTURE:
        return "The requested resource is temporarily unavailable.";
      case ErrorCategory.SYSTEM:
        return "An unexpected error occurred. Please try again.";
      default:
        return "An error occurred while processing your request.";
    }
  }

  // Detailed message for logging
  getDetailedMessage(): string {
    return (
      `[${this.severity}] ${this.category} Error: ${this.message}\n` +
      `Code: ${this.code}\n` +
      `Context: ${JSON.stringify(this.context, null, 2)}\n` +
      `Error Chain:\n${this.getErrorChainString()}`
    );
  }

  shouldRetry(): boolean {
    return (
      this.isRecoverable &&
      this.category === ErrorCategory.INFRASTRUCTURE &&
      this.severity !== ErrorSeverity.CRITICAL
    );
  }
}

// ===== ERROR FACTORY PATTERN =====
// This centralizes error creation and ensures consistency
export class ErrorFactory {
  private static correlationId?: string;

  static setCorrelationId(id: string): void {
    this.correlationId = id;
  }

  static createContext(
    layer: TLayer,
    method: string,
    metadata?: Record<string, unknown>,
  ): ErrorContext {
    return {
      layer,
      method,
      timestamp: new Date(),
      metadata,
      correlationId: this.correlationId,
    };
  }

  // Domain errors
  static questDifficultyNotSet(questId: string): AppError {
    return new AppError(
      `Quest difficulty not set for quest ${questId}`,
      AppErrorCodes.MISSING_REQUIRED_DATA,
      ErrorCategory.DOMAIN,
      ErrorSeverity.LOW,
      ErrorFactory.createContext("Entity", "getQuestDifficulty", {
        questId: questId,
      }),
      {
        userMessage: "Please select a difficulty level for this quest.",
        isRecoverable: true,
      },
    );
  }

  static questDifficultyNotAvailable(
    questId: string,
    difficulty: questDifficulty,
  ): AppError {
    return new AppError(
      `No configuration found for difficulty ${difficulty} in quest ${questId}`,
      AppErrorCodes.MISSING_REQUIRED_DATA,
      ErrorCategory.DOMAIN,
      ErrorSeverity.LOW,
      ErrorFactory.createContext("Entity", "getQuestConfiguration", {
        questId: questId,
        difficulty: difficulty,
      }),
      {
        userMessage: "The selected difficulty is not available for this quest.",
        isRecoverable: true,
      },
    );
  }

  static questNotFound(questId: string): AppError {
    return new AppError(
      `Quest with id ${questId} not found`,
      AppErrorCodes.RESOURCE_NOT_FOUND,
      ErrorCategory.INFRASTRUCTURE,
      ErrorSeverity.LOW,
      ErrorFactory.createContext("Entity", "getQuestConfiguration", {
        questId: questId,
      }),
      {
        userMessage: "The requested quest could not be found.",
        isRecoverable: false,
      },
    );
  }

  // System errors (for unexpected exceptions)
  static unexpectedError(
    context: ErrorContext,
    originalError: unknown,
    cause?: AppError,
  ): AppError {
    const errorMessage =
      originalError instanceof Error
        ? originalError.message
        : String(originalError);
    return new AppError(
      `Unexpected error: ${errorMessage}`,
      AppErrorCodes.UNEXPECTED_ERROR,
      ErrorCategory.SYSTEM,
      ErrorSeverity.HIGH,
      context,
      {
        cause,
        isRecoverable: false,
        userMessage: "An unexpected error occurred.",
      },
    );
  }

  // Chain an existing error to a new context
  static chainError(
    originalError: AppError,
    context: ErrorContext,
    message?: string,
  ): AppError {
    return new AppError(
      message ?? `Error propagated because ${originalError.context.layer}`,
      originalError.code,
      originalError.category,
      originalError.severity,
      context,
      {
        cause: originalError,
        isRecoverable: originalError.isRecoverable,
        userMessage: originalError.userMessage,
      },
    );
  }
}

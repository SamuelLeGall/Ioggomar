import { questDifficulty } from "@src/models/quests/QuestsModels";

export type Result<T> = [T, null] | [null, AppError];
export type FrontendResult<T> = [T, null] | [null, string];

// Helper type guards
export class ResultFactory {
  static isSuccess<T>(result: Result<T>): result is [T, null] {
    return result[1] === null;
  }

  static isError<T>(result: Result<T>): result is [null, AppError] {
    return result[1] !== null;
  }

  static isErrorFrontend<T>(
    result: FrontendResult<T>,
  ): result is [null, string] {
    return result[1] !== null;
  }
}

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
export type TAction = "ATTACK";
export interface OptionConfig {
  key: string;
  value: string;
}

// ===== DOMAIN-SPECIFIC ERROR CATEGORIES =====
// This is a key principle: errors should be categorized by domain meaning, not technical implementation

export type TLayer =
  | "Service"
  | "Mapper"
  | "Entity"
  | "Repository"
  | "LocalDatabase"
  | "Collection"
  | "Document";

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
  STORAGE_UNAVAILABLE = "STORAGE_UNAVAILABLE",

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

// ==========================================
// SUPPORTING TYPES
// ==========================================

interface ErrorHistoryEntry {
  depth: number;
  message: string;
  code: AppErrorCodes;
  category: ErrorCategory;
  severity: ErrorSeverity;
  context: ErrorContext;
  userMessage?: string;
  isRecoverable: boolean;
  timestamp: Date;
}

interface StructuredErrorLog {
  timestamp: string;
  errorId: string;
  summary: {
    message: string;
    code: AppErrorCodes;
    category: ErrorCategory;
    severity: ErrorSeverity;
    isRecoverable: boolean;
    userMessage: string;
  };
  rootCause: {
    message: string;
    code: AppErrorCodes;
    layer: string;
    method: string;
  };
  trace: {
    methodChain: string;
    errorChain: string;
    depth: number;
  };
  metadata: Record<string, unknown>;
  correlationId?: string;
  stack?: string;
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
  static combatActionNotFound(action: TAction): AppError {
    return new AppError(
      `The selected action  ${action} does not exist or is not implemented`,
      AppErrorCodes.BUSINESS_RULE_VIOLATION,
      ErrorCategory.DOMAIN,
      ErrorSeverity.MEDIUM,
      ErrorFactory.createContext("Service", "performAction", {
        action,
      }),
      {
        userMessage:
          "The selected action is not available please try another action.",
        isRecoverable: true,
      },
    );
  }

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

  static questItemProgressionNotFound(
    questId: string,
    staticQuestId: string,
    idItem: string,
  ): AppError {
    return new AppError(
      `Quest progression data not found for quest ${questId} (static:${staticQuestId}) and progressionItem: ${idItem}`,
      AppErrorCodes.MISSING_REQUIRED_DATA,
      ErrorCategory.DOMAIN,
      ErrorSeverity.MEDIUM,
      ErrorFactory.createContext("Entity", "getItemProgressionById", {
        questId: questId,
        staticQuestId: staticQuestId,
        idItem: idItem,
      }),
      {
        userMessage:
          "We could not find your progress for one objective of this quest. Please cancel it then try again.",
        isRecoverable: true,
      },
    );
  }

  static resourceNotFound(
    context: ErrorContext,
    resourceType: string,
    resourceId: string,
    message?: string,
  ): AppError {
    return new AppError(
      message ?? `${resourceType} with id ${resourceId} not found`,
      AppErrorCodes.RESOURCE_NOT_FOUND,
      ErrorCategory.INFRASTRUCTURE,
      ErrorSeverity.LOW,
      context,
      {
        userMessage: `The requested ${resourceType} could not be found.`,
        isRecoverable: false,
      },
    );
  }

  static resourceConflict(
    context: ErrorContext,
    resourceType: string,
    id: string,
  ): AppError {
    return new AppError(
      `${resourceType} with id '${id}' already exists`,
      AppErrorCodes.RESOURCE_CONFLICT,
      ErrorCategory.INFRASTRUCTURE,
      ErrorSeverity.MEDIUM,
      context,
      {
        userMessage: `The requested ${resourceType} already exists.`,
        isRecoverable: false,
      },
    );
  }

  // Database-specific errors
  static storageUnavailable(context: ErrorContext): AppError {
    return new AppError(
      "Local storage is not available or full",
      AppErrorCodes.STORAGE_UNAVAILABLE,
      ErrorCategory.INFRASTRUCTURE,
      ErrorSeverity.MEDIUM,
      context,
      {
        userMessage: "An Error occured with the DB",
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
      message ??
        `Error propagated because of ${originalError.context.layer}.${originalError.context.method}`,
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

// ===== ENHANCED ERROR CLASS WITH COMPREHENSIVE LOGGING =====
export class AppError extends Error {
  public readonly code: AppErrorCodes;
  public readonly category: ErrorCategory;
  public readonly severity: ErrorSeverity;
  public readonly context: ErrorContext;
  public readonly cause?: AppError;
  public readonly errorChain: ErrorContext[];
  public readonly isRecoverable: boolean;
  public readonly userMessage?: string;

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

  // ==========================================
  // NEW: COMPREHENSIVE ERROR HISTORY METHODS
  // ==========================================

  /**
   * Get the complete error history with all messages and contexts
   * This traverses the full cause chain and provides detailed information
   */
  getCompleteErrorHistory(): ErrorHistoryEntry[] {
    const history: ErrorHistoryEntry[] = [];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let currentError: AppError | undefined = this;
    let depth = 0;

    while (currentError) {
      history.push({
        depth,
        message: currentError.message,
        code: currentError.code,
        category: currentError.category,
        severity: currentError.severity,
        context: currentError.context,
        userMessage: currentError.userMessage,
        isRecoverable: currentError.isRecoverable,
        timestamp: currentError.context.timestamp,
      });

      currentError = currentError.cause;
      depth++;
    }

    return history;
  }

  /**
   * Get a formatted string representation of the complete error history
   * Perfect for logging and debugging
   */
  getFormattedErrorHistory(): string {
    const history = this.getCompleteErrorHistory();
    const lines: string[] = [];

    lines.push(`🔴 ERROR TRACE (${history.length} levels deep)`);
    lines.push(`═══════════════════════════════════════════════════════════`);

    history.forEach((entry, index) => {
      const indent = "  ".repeat(entry.depth);
      const isRoot = entry.depth === history.length - 1;
      const prefix = isRoot ? "🟡 ROOT CAUSE" : `🔸 LEVEL ${entry.depth + 1}`;

      lines.push(`${indent}${prefix}`);
      lines.push(`${indent}├─ Message: ${entry.message}`);
      lines.push(`${indent}├─ Code: ${entry.code}`);
      lines.push(`${indent}├─ Category: ${entry.category} (${entry.severity})`);
      lines.push(
        `${indent}├─ Layer: ${entry.context.layer}.${entry.context.method}`,
      );
      lines.push(`${indent}├─ Time: ${entry.timestamp.toISOString()}`);

      if (
        entry.context.metadata &&
        Object.keys(entry.context.metadata).length > 0
      ) {
        lines.push(
          `${indent}├─ Metadata: ${JSON.stringify(entry.context.metadata, null, 2).replace(/\n/g, `\n${indent}│    `)}`,
        );
      }

      if (entry.context.correlationId) {
        lines.push(
          `${indent}├─ Correlation ID: ${entry.context.correlationId}`,
        );
      }

      if (entry.userMessage) {
        lines.push(`${indent}├─ User Message: "${entry.userMessage}"`);
      }

      lines.push(
        `${indent}└─ Recoverable: ${entry.isRecoverable ? "✅" : "❌"}`,
      );

      if (index < history.length - 1) {
        lines.push(`${indent}   ↓`);
      }
    });

    lines.push(`═══════════════════════════════════════════════════════════`);
    return lines.join("\n");
  }

  /**
   * Get a compact one-line error trace for quick debugging
   */
  getErrorTraceOneLine(): string {
    const history = this.getCompleteErrorHistory();
    const trace = history
      .map(
        (entry) =>
          `${entry.context.layer}.${entry.context.method}[${entry.code}]`,
      )
      .join(" → ");

    return `${this.severity} ${this.category}: ${trace}`;
  }

  /**
   * Get just the method call chain for debugging
   */
  getMethodCallChain(): string {
    const history = this.getCompleteErrorHistory();
    return history
      .map((entry) => `${entry.context.layer}.${entry.context.method}()`)
      .join(" → ");
  }

  /**
   * Get all error messages in chronological order (root to current)
   */
  getAllErrorMessages(): string[] {
    const history = this.getCompleteErrorHistory();
    return history.reverse().map((entry) => entry.message);
  }

  /**
   * Get metadata from all error levels combined
   */
  getCombinedMetadata(): Record<string, unknown> {
    const history = this.getCompleteErrorHistory();
    const combined: Record<string, unknown> = {};

    // Start from root cause and work up, so newer metadata overwrites older
    history.reverse().forEach((entry, index) => {
      if (entry.context.metadata) {
        Object.entries(entry.context.metadata).forEach(([key, value]) => {
          // Prefix with level to avoid conflicts
          const prefixedKey = index === 0 ? key : `level${entry.depth}_${key}`;
          combined[prefixedKey] = value;
        });
      }

      // Add some context info
      combined[`level${entry.depth}_layer`] = entry.context.layer;
      combined[`level${entry.depth}_method`] = entry.context.method;
      combined[`level${entry.depth}_timestamp`] = entry.context.timestamp;
    });

    return combined;
  }

  /**
   * Check if error chain contains specific error code
   */
  hasErrorCodeInChain(code: AppErrorCodes): boolean {
    const history = this.getCompleteErrorHistory();
    return history.some((entry) => entry.code === code);
  }

  /**
   * Check if error chain passed through specific layer
   */
  hasPassedThroughLayer(layer: string): boolean {
    const history = this.getCompleteErrorHistory();
    return history.some((entry) => entry.context.layer === layer);
  }

  /**
   * Get the error at a specific depth (0 = current, 1 = immediate cause, etc.)
   */
  getErrorAtDepth(depth: number): ErrorHistoryEntry | null {
    const history = this.getCompleteErrorHistory();
    return history.find((entry) => entry.depth === depth) || null;
  }

  // ==========================================
  // LOGGING CONVENIENCE METHODS
  // ==========================================

  /**
   * Log the complete error to console with proper formatting
   */
  logToConsole(): void {
    console.group(`🔴 ${this.severity} ${this.category} Error`);
    console.error(this.getFormattedErrorHistory());
    console.groupEnd();
  }

  /**
   * Get error data optimized for external logging services (structured data)
   */
  getStructuredLogData(): StructuredErrorLog {
    const history = this.getCompleteErrorHistory();
    const rootCause = history[history.length - 1];

    return {
      timestamp: new Date().toISOString(),
      errorId: this.generateErrorId(),
      summary: {
        message: this.message,
        code: this.code,
        category: this.category,
        severity: this.severity,
        isRecoverable: this.isRecoverable,
        userMessage: this.userMessage || this.getPublicMessage(),
      },
      rootCause: {
        message: rootCause.message,
        code: rootCause.code,
        layer: rootCause.context.layer,
        method: rootCause.context.method,
      },
      trace: {
        methodChain: this.getMethodCallChain(),
        errorChain: this.getErrorTraceOneLine(),
        depth: history.length,
      },
      metadata: this.getCombinedMetadata(),
      correlationId: this.context.correlationId,
      stack: this.stack,
    };
  }

  /**
   * Generate a unique error ID for tracking
   */
  private generateErrorId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    const codeHash = this.code.substr(0, 4);
    return `${codeHash}-${timestamp}-${random}`.toUpperCase();
  }

  // ==========================================
  // EXISTING METHODS (KEPT FOR COMPATIBILITY)
  // ==========================================

  getRootCause(): AppError {
    return this.cause ? this.cause.getRootCause() : this;
  }

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

  shouldRetry(): boolean {
    return (
      this.isRecoverable &&
      this.category === ErrorCategory.INFRASTRUCTURE &&
      this.severity !== ErrorSeverity.CRITICAL
    );
  }
}

// ==========================================
// USAGE EXAMPLES
// ==========================================

/*

1. Complete Formatted Output for Console
// good readibility in console
error.logToConsole();

2. Complete Error History Traversal
// Gets EVERY error in the cause chain with full details (full JS objects)
const history = error.getCompleteErrorHistory();

3. Quick Debugging Methods
// Method call chain
error.getMethodCallChain();
// "Repository.getById() → Service.getQuestById() → Controller.handleRequest()"

// One-line trace
error.getErrorTraceOneLine();
// "MEDIUM INFRASTRUCTURE: Repository.getById[RESOURCE_NOT_FOUND] → Service.getQuestById[RESOURCE_NOT_FOUND]"

// All error messages
error.getAllErrorMessages();
// ["quest with id quest-123 not found", "Error propagated because Repository"]

4. File logging
logger.error(error.getFormattedErrorHistory());

5. Advanced Query Methods
// Check if specific error code exists anywhere in the chain
if (error.hasErrorCodeInChain(AppErrorCodes.RESOURCE_NOT_FOUND)) {
  // Handle not found scenario
}

// Check if error passed through specific layer
if (error.hasPassedThroughLayer("Repository")) {
  // This is a data access issue
}

// Get error at specific depth
const rootCause = error.getErrorAtDepth(2); // 2 levels deep

6. Structured as Object
const logData = error.getStructuredLogData();
*/

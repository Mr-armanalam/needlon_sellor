export interface LoggerContext {
    module?: string;
    action?: string;
    sellerId?: string;
    productId?: string;
    requestId?: string;
    metadata?: Record<string, unknown>;
}

export interface Logger {
    info(
        message: string,
        context?: LoggerContext,
    ): void;

    warn(
        message: string,
        context?: LoggerContext,
    ): void;

    error(
        message: string,
        error?: unknown,
        context?: LoggerContext,
    ): void;

    debug(
        message: string,
        context?: LoggerContext,
    ): void;
}
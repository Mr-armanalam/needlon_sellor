import { LoggerContext } from "./types";

function timestamp() {
    return new Date().toISOString();
}

function format(
    level: string,
    message: string,
    context?: LoggerContext,
) {
    return {
        timestamp: timestamp(),
        level,
        message,
        ...context,
    };
}

export const consoleTransport = {
    info(
        message: string,
        context?: LoggerContext,
    ) {
        console.info(format("INFO", message, context));
    },

    warn(
        message: string,
        context?: LoggerContext,
    ) {
        console.warn(format("WARN", message, context));
    },

    debug(
        message: string,
        context?: LoggerContext,
    ) {
        if (process.env.NODE_ENV !== "production") {
            console.debug(format("DEBUG", message, context));
        }
    },

    error(
        message: string,
        error?: unknown,
        context?: LoggerContext,
    ) {
        console.error(
            format("ERROR", message, {
                ...context,
                metadata: {
                    ...context?.metadata,
                    error,
                },
            }),
        );
    },
};
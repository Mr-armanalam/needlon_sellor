import { consoleTransport } from "./transport";
import { Logger } from "./types";

export const logger: Logger = {
    info: consoleTransport.info,

    warn: consoleTransport.warn,

    debug: consoleTransport.debug,

    error: consoleTransport.error,
};
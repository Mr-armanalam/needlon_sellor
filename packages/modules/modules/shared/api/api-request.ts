export interface ApiRequestOptions
    extends Omit<RequestInit, "body" | "method"> {
    signal?: AbortSignal;
}
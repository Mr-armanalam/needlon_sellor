export function normalizeSearch(
    value?: string,
) {
    return value?.trim() ?? "";
}

export function hasSearch(
    value?: string,
) {
    return normalizeSearch(value).length > 0;
}
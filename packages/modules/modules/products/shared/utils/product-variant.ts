export function buildVariantName(
    values: string[],
) {
    return values
        .filter(Boolean)
        .join(" / ");
}
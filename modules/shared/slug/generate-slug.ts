import {
    normalizeSlug,
} from "./normalize-slug";

import {
    slugifyText,
} from "./slugify";

export function generateSlug(
    value: string,
) {
    return slugifyText(
        normalizeSlug(value),
    );
}
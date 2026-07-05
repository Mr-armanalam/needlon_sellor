import {findStoreBySlug} from "@/modules/seller-profile/repositery/find-store-by-slug";

export async function ensureUniqueStoreSlug(
    slug: string,
) {
    let candidate = slug;

    let index = 2;

    while (
        await findStoreBySlug(candidate)
        ) {
        candidate =
            `${slug}-${index}`;

        index++;
    }

    return candidate;
}
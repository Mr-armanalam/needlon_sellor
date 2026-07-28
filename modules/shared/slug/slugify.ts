import slugify from "@sindresorhus/slugify";

export function slugifyText(
    value: string,
) {
    return slugify(value);
}
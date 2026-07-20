import { generateSlug } from "./generate-slug";

export async function generateUniqueSlug(
  value: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  const baseSlug = generateSlug(value) || "item";
  let candidate = baseSlug;
  let counter = 1;

  while (await exists(candidate)) {
    candidate = `${baseSlug}-${counter}`;
    counter++;
  }

  return candidate;
}
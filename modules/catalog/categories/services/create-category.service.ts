import { NotFoundError } from "@/modules/shared/errors/not-found-error";

import { createCategory } from "../repository/commands/create-category";
// ⚠️ ASSUMPTION: update-category.ts command exists (it's in your file
// tree) but its content wasn't shown to me. I'm assuming the same
// single-object-param convention as create-category.ts:
//   updateCategory(id: string, data: Partial<NewCategoryEntity>)
// Please correct if the real signature differs.
import { updateCategory } from "../repository/commands/update-category";
import { getCategory } from "../repository/queries/get-category";
import { existsCategorySlug } from "../repository/queries/exists-category-slug";
import { computeCategoryHierarchy } from "../lib/compute-category-path";

// ⚠️ ASSUMPTION: shared/slug/generate-unique-slug.ts signature. Guessing:
//   generateUniqueSlug(base: string, exists: (slug: string) => Promise<boolean>): Promise<string>
import { generateUniqueSlug } from "@/modules/shared/slug/generate-unique-slug";

interface CreateCategoryServiceInput {
    name: string;
    displayName?: string;
    description?: string;
    parentId?: string | null;
    coverImagePath?: string;
    coverImageUrl?: string;
    code: string;
    isFeatured?: boolean;
    isVisible?: boolean;
    sortOrder?: number;
    metadata?: unknown;
    createdBy: string;
}

export async function createCategoryService(
    input: CreateCategoryServiceInput,
) {

    const parent = input.parentId
        ? await getCategory(input.parentId)
        : null;

    if (input.parentId && !parent) {
        throw new NotFoundError("Parent category not found.");
    }

    const slug = await generateUniqueSlug(
        input.name,
        (candidate) => existsCategorySlug(candidate),
    );

    const { path, level } = computeCategoryHierarchy(parent);

    const category = await createCategory({
        name: input.name,
        displayName: input.displayName,
        slug,
        description: input.description,
        parentId: input.parentId ?? null,
        coverImagePath: input.coverImagePath,
        coverImageUrl: input.coverImageUrl,
        code: input.code,
        path,
        level,
        isLeaf: true,
        isFeatured: input.isFeatured ?? false,
        isVisible: input.isVisible ?? true,
        sortOrder: input.sortOrder ?? 0,
        metadata: input.metadata,
        createdBy: input.createdBy,
        updatedBy: input.createdBy,
    });

    // A new child means the parent is no longer a leaf.
    // ⚠️ NOT atomic with the insert above — repository commands don't
    // currently accept an external transaction handle. If two categories
    // are created under the same brand-new parent concurrently this is
    // fine (idempotent, just sets isLeaf: false again), but flagging
    // since "production grade" may want this wrapped in one tx.
    if (parent && parent.isLeaf !== false) {
        await updateCategory(parent.id, { isLeaf: false });
    }

    return category;

}
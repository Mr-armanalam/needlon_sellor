// ⚠️ ASSUMPTION: import path + exact generic shape of ListQuery, since
// I've seen shared/query/list-query.ts exists but not its contents in
// this codebase (only the earlier, now-superseded version I wrote
// myself). Adjust the import/shape to match the real file.
import type { ListQuery } from "@/modules/shared/query/list-query";

import { listCategories } from "../repository/queries/list-categories";

interface CategoryFilters {
    parentId?: string | null;
    status?: string;
    isFeatured?: boolean;
    isVisible?: boolean;
}

type CategorySortField = "name" | "createdAt" | "sortOrder";

export async function getCategoriesService(
    query: ListQuery<CategorySortField, CategoryFilters>,
) {

    return listCategories(query);

}
import {
    InferInsertModel,
    InferSelectModel,
} from "drizzle-orm";

import { categories } from "./table";

export type CategoryEntity =
    InferSelectModel<typeof categories>;

export type NewCategoryEntity =
    InferInsertModel<typeof categories>;
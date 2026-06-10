import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

const for_which_enum = pgEnum('for_which_type', ['Men', 'Women', 'others'])

export const subcatSearchItem = pgTable('subcatSearch', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  image: text('image'),
  for_which: for_which_enum().default('Men'),
})
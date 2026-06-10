import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const heroItems = pgTable('heroItems', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  offer: text('offer').notNull(),
  slug: text('slug'),
  timestamp: timestamp('createdAt').defaultNow()
})
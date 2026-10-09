import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const clientHeroBannersTable = pgTable("client_hero_banners", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 150 }).notNull(),
  description: text("description"),
  image: text("image").notNull(),
  offer: varchar("offer", { length: 100 }),
  slug: varchar("slug", { length: 150 }),
  displayOrder: integer("display_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ClientHeroBanner = typeof clientHeroBannersTable.$inferSelect;
export type NewClientHeroBanner = typeof clientHeroBannersTable.$inferInsert;

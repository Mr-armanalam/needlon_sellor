import {
  pgTable,
  uuid,
  varchar,
  text,
  smallint,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
  AnyPgColumn,
} from "drizzle-orm/pg-core";

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Self-reference foreign key for nested hierarchies
    parentId: uuid("parent_id").references((): AnyPgColumn => categories.id, {
      onDelete: "cascade",
    }),

    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 150 }).notNull(),
    description: text("description"),
    iconUrl: text("icon_url"),
    bannerUrl: text("banner_url"),

    displayOrder: integer("display_order").default(0).notNull(),
    level: smallint("level").default(1).notNull(),
    isActive: boolean("is_active").default(true).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("categories_slug_idx").on(table.slug)],
);

import { 
  pgTable, 
  uuid, 
  text, 
  timestamp, 
  pgEnum,
  index 
} from 'drizzle-orm/pg-core';
import { product_orders } from './orders'; // Reference to your master orders schema

// Enums defining actors, accessibility levels, and categories
export const orderNoteAuthorEnum = pgEnum('order_note_author_type', [
  'BUYER', 'SELLER', 'ADMIN', 'SYSTEM', 'DELIVERY_PARTNER'
]);

export const orderNoteVisibilityEnum = pgEnum('order_note_visibility', [
  'PRIVATE', 'BUYER_VISIBLE', 'SELLER_VISIBLE', 'ADMIN_ONLY'
]);

export const orderNoteTypeEnum = pgEnum('order_note_type', [
  'GENERAL', 'DELIVERY', 'PACKING', 'PAYMENT', 'RETURN', 'DISPUTE', 'SYSTEM_EVENT'
]);

export const orderNotes = pgTable('order_notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id')
    .references(() => product_orders.id, { onDelete: 'cascade' })
    .notNull(),
  
  authorType: orderNoteAuthorEnum('author_type').notNull(),
  authorId: uuid('author_id'), // Nullable to easily support 'SYSTEM' actors
  
  visibility: orderNoteVisibilityEnum('visibility').default('PRIVATE').notNull(),
  noteType: orderNoteTypeEnum('note_type').default('GENERAL').notNull(),
  
  message: text('message').notNull(),
  
  // Ledger timeline record - deliberately missing an updated_at column to ensure immutability
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    notesOrderTimelineIdx: index('order_notes_timeline_idx').on(table.orderId, table.createdAt),
    notesVisibilityIdx: index('order_notes_visibility_idx').on(table.visibility),
  };
});
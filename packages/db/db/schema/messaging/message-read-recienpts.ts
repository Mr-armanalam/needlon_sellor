import {
  pgTable,
  uuid,
  timestamp,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { messages } from "./messages";
import { conversationParticipants } from "./conversation-participants";

// Receipt Status Enum supporting future granular tracking behaviors
export const receiptStatusEnum = pgEnum("message_receipt_status", [
  "READ",
  "DELIVERED",
  "PLAYED",
]);

export const messageReadReceipts = pgTable(
  "message_read_receipts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    messageId: uuid("message_id")
      .references(() => messages.id, { onDelete: "cascade" })
      .notNull(),

    // Maps to the specific participant bridge entry to identify the reader securely
    conversationParticipantId: uuid("conversation_participant_id")
      .references(() => conversationParticipants.id, { onDelete: "cascade" })
      .notNull(),

    status: receiptStatusEnum("status").default("READ").notNull(),

    // Audits & Chronologies (Missing an updated_at column to guarantee complete immutability)
    readAt: timestamp("read_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      // Structural Rule: A single participant can only read/interact with a specific message once
      receiptUserMessageUniqIdx: uniqueIndex("receipt_user_msg_uniq_idx").on(
        table.messageId,
        table.conversationParticipantId,
      ),
      receiptParticipantLookupIdx: index("receipt_participant_lookup_idx").on(
        table.conversationParticipantId,
      ),
    };
  },
);

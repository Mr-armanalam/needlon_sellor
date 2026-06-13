ALTER TABLE "sessions" ADD COLUMN "refresh_token_version" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "last_rotated_at" timestamp;
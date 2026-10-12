ALTER TABLE "sessions"
  ADD COLUMN "previous_refresh_token" text,
  ADD COLUMN "previous_refresh_token_expires_at" timestamp;
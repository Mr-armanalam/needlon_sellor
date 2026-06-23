CREATE TYPE "public"."role" AS ENUM('seller', 'admin');--> statement-breakpoint
ALTER TABLE "seller" ADD COLUMN "role" "role" DEFAULT 'seller' NOT NULL;
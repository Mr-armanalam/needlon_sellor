CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "product_items" ALTER COLUMN "mrp_price" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "product_items" ALTER COLUMN "price" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "product_items" ADD COLUMN "sizes" text[];--> statement-breakpoint
ALTER TABLE "product_items" ADD COLUMN "seller" uuid;--> statement-breakpoint
ALTER TABLE "product_items" ADD COLUMN "sales_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "subcatSearch" ADD COLUMN "for_which" "for_which_type" DEFAULT 'Men';--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_items" ADD CONSTRAINT "product_items_seller_users_id_fk" FOREIGN KEY ("seller") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "wishlist_upsert_idx" ON "wishlist_items" USING btree ("user_id","product_id","size");
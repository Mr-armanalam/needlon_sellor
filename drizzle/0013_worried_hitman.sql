CREATE TYPE "public"."order_manifest_status" AS ENUM('GENERATED', 'DISPATCHED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "order_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"invoice_number" varchar(100) NOT NULL,
	"status" "invoice_status" DEFAULT 'ISSUED' NOT NULL,
	"subtotal" numeric(18, 2) NOT NULL,
	"tax_total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"discount_total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"shipping_charge" numeric(18, 2) DEFAULT '0' NOT NULL,
	"grand_total" numeric(18, 2) NOT NULL,
	"pdf_url" text,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"cancelled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "order_invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "order_manifest_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manifest_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_manifests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"manifest_number" varchar(100) NOT NULL,
	"courier_name" varchar(100) NOT NULL,
	"pickup_date" timestamp with time zone NOT NULL,
	"total_orders" integer DEFAULT 0 NOT NULL,
	"total_weight" numeric(10, 3) DEFAULT '0' NOT NULL,
	"status" "order_manifest_status" DEFAULT 'GENERATED' NOT NULL,
	"pdf_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "order_manifests_manifest_number_unique" UNIQUE("manifest_number")
);
--> statement-breakpoint
ALTER TABLE "order_invoices" ADD CONSTRAINT "order_invoices_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_invoices" ADD CONSTRAINT "order_invoices_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_manifest_items" ADD CONSTRAINT "order_manifest_items_manifest_id_order_manifests_id_fk" FOREIGN KEY ("manifest_id") REFERENCES "public"."order_manifests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_manifest_items" ADD CONSTRAINT "order_manifest_items_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_manifests" ADD CONSTRAINT "order_manifests_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "order_invoices_order_idx" ON "order_invoices" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_invoices_seller_idx" ON "order_invoices" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "order_invoices_number_idx" ON "order_invoices" USING btree ("invoice_number");--> statement-breakpoint
CREATE INDEX "order_manifest_items_manifest_idx" ON "order_manifest_items" USING btree ("manifest_id");--> statement-breakpoint
CREATE INDEX "order_manifest_items_order_idx" ON "order_manifest_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_manifests_seller_idx" ON "order_manifests" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "order_manifests_number_idx" ON "order_manifests" USING btree ("manifest_number");
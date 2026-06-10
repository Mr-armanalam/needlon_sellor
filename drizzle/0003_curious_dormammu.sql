CREATE TYPE "public"."delivery_type" AS ENUM('on-shop', 'home');--> statement-breakpoint
CREATE TYPE "public"."status_type" AS ENUM('active', 'upcoming', 'expired');--> statement-breakpoint
CREATE TABLE "filter_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "filter_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filter_group_id" uuid NOT NULL,
	"value" text NOT NULL,
	"slug" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "heroItems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"image" text NOT NULL,
	"offer" text NOT NULL,
	"slug" text,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "order_status" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"details" text[],
	"isActive" boolean,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" text NOT NULL,
	"category_type" text NOT NULL,
	"sub_category_type" text NOT NULL,
	"content_tag" text,
	"descriptive_content" text,
	"createdat" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_filter_options" (
	"product_id" uuid NOT NULL,
	"filter_option_id" uuid NOT NULL,
	CONSTRAINT "product_filter_options_product_id_filter_option_id_pk" PRIMARY KEY("product_id","filter_option_id")
);
--> statement-breakpoint
CREATE TABLE "productReview" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"user_id" uuid NOT NULL,
	"username" text NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rewards_schema" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coupon_id" uuid NOT NULL,
	"title" text NOT NULL,
	"discount" text NOT NULL,
	"discription" text NOT NULL,
	"gradient_color" text DEFAULT 'from-purple-500 to-pink-500' NOT NULL,
	"status" "status_type" DEFAULT 'upcoming',
	"valide_from" date DEFAULT now() NOT NULL,
	"valide_to" date NOT NULL,
	"createdat" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subcatSearch" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "update_schema" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"update_type" text NOT NULL,
	"notification_time" timestamp DEFAULT now() NOT NULL,
	"is_readed" boolean DEFAULT false NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_view_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_order_id_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "currency" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product_items" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product_items" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "rating" uuid;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "invoice" text;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "order_properties" text;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "delivery_date" timestamp;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "order_status" uuid;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "shipping_charge" integer;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "delivery_type" "delivery_type" DEFAULT 'home';--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "paymentMode" varchar DEFAULT 'card';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "coupon_discount" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "couponId" uuid;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "mrp_price" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "pod_charge" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_address" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "product_items" ADD COLUMN "category_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "product_items" ADD COLUMN "tag_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product_items" ADD COLUMN "average_rating" numeric(3, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_items" ADD COLUMN "review_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "product_items" ADD COLUMN "is_premium" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "filter_groups" ADD CONSTRAINT "filter_groups_category_id_product_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "filter_options" ADD CONSTRAINT "filter_options_filter_group_id_filter_groups_id_fk" FOREIGN KEY ("filter_group_id") REFERENCES "public"."filter_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_filter_options" ADD CONSTRAINT "product_filter_options_product_id_product_items_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_filter_options" ADD CONSTRAINT "product_filter_options_filter_option_id_filter_options_id_fk" FOREIGN KEY ("filter_option_id") REFERENCES "public"."filter_options"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productReview" ADD CONSTRAINT "productReview_product_id_product_items_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productReview" ADD CONSTRAINT "productReview_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards_schema" ADD CONSTRAINT "rewards_schema_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "update_schema" ADD CONSTRAINT "update_schema_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_view_history" ADD CONSTRAINT "user_view_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_view_history" ADD CONSTRAINT "user_view_history_product_id_product_items_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_product_items_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_rating_productReview_id_fk" FOREIGN KEY ("rating") REFERENCES "public"."productReview"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_status_order_status_id_fk" FOREIGN KEY ("order_status") REFERENCES "public"."order_status"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_couponId_coupons_id_fk" FOREIGN KEY ("couponId") REFERENCES "public"."coupons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_address_user_address_id_fk" FOREIGN KEY ("shipping_address") REFERENCES "public"."user_address"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_items" ADD CONSTRAINT "product_items_category_id_product_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_items" DROP COLUMN "category";--> statement-breakpoint
ALTER TABLE "product_items" DROP COLUMN "category_type";--> statement-breakpoint
ALTER TABLE "product_items" DROP COLUMN "sub_category_type";--> statement-breakpoint
ALTER TABLE "product_items" DROP COLUMN "sizes";--> statement-breakpoint
ALTER TABLE "product_items" DROP COLUMN "material";
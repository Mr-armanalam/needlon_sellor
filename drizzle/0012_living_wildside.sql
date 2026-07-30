CREATE TYPE "public"."ai_moderation_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED');--> statement-breakpoint
CREATE TYPE "public"."attribute_data_type" AS ENUM('STRING', 'INTEGER', 'DECIMAL', 'BOOLEAN', 'DATE', 'JSON');--> statement-breakpoint
CREATE TYPE "public"."attribute_option_status" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TYPE "public"."category_image_type" AS ENUM('COVER', 'BANNER', 'ICON');--> statement-breakpoint
CREATE TYPE "public"."category_visibility" AS ENUM('PUBLIC', 'PRIVATE');--> statement-breakpoint
CREATE TYPE "public"."dimension_unit" AS ENUM('CM', 'MM', 'IN');--> statement-breakpoint
CREATE TYPE "public"."product_image_status" AS ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."product_image_storage_provider" AS ENUM('SUPABASE', 'S3', 'CLOUDINARY', 'R2', 'LOCAL', 'CUSTOM');--> statement-breakpoint
CREATE TYPE "public"."product_image_type" AS ENUM('GALLERY', 'THUMBNAIL', 'COVER', 'DETAIL');--> statement-breakpoint
CREATE TYPE "public"."product_variant_status" AS ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."product_video_status" AS ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."product_video_storage_provider" AS ENUM('SUPABASE', 'S3', 'CLOUDINARY', 'MUX', 'R2', 'LOCAL', 'CUSTOM');--> statement-breakpoint
CREATE TYPE "public"."product_video_type" AS ENUM('GALLERY', 'DEMO', 'TUTORIAL', 'PROMOTIONAL');--> statement-breakpoint
CREATE TYPE "public"."robots_directive" AS ENUM('INDEX_FOLLOW', 'INDEX_NOFOLLOW', 'NOINDEX_FOLLOW', 'NOINDEX_NOFOLLOW');--> statement-breakpoint
CREATE TYPE "public"."shipping_class" AS ENUM('STANDARD', 'EXPRESS', 'HEAVY', 'OVERSIZED', 'COLD_CHAIN', 'CUSTOM');--> statement-breakpoint
CREATE TYPE "public"."weight_unit" AS ENUM('KG', 'G', 'LB', 'OZ');--> statement-breakpoint
CREATE TYPE "public"."order_priority" AS ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT');--> statement-breakpoint
CREATE TYPE "public"."order_source" AS ENUM('WEB', 'ANDROID', 'IOS', 'ADMIN', 'API');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('DRAFT', 'PENDING', 'CONFIRMED', 'PROCESSING', 'READY_TO_SHIP', 'PARTIALLY_SHIPPED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURN_APPROVED', 'RETURN_REJECTED', 'RETURNED', 'REFUND_PENDING', 'REFUNDED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."order_payment_method" AS ENUM('COD', 'UPI', 'CARD', 'NET_BANKING', 'WALLET', 'BANK_TRANSFER');--> statement-breakpoint
CREATE TYPE "public"."order_payment_status" AS ENUM('PENDING', 'AUTHORIZED', 'PARTIALLY_PAID', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."shipping_method" AS ENUM('STANDARD', 'EXPRESS', 'SAME_DAY', 'NEXT_DAY', 'STORE_PICKUP');--> statement-breakpoint
CREATE TYPE "public"."order_item_discount_type" AS ENUM('NONE', 'FLAT', 'PERCENTAGE');--> statement-breakpoint
CREATE TYPE "public"."order_item_fulfillment_type" AS ENUM('STANDARD', 'EXPRESS', 'SAME_DAY', 'STORE_PICKUP', 'DIGITAL', 'CUSTOM_MADE', 'PRE_ORDER', 'BACK_ORDER');--> statement-breakpoint
CREATE TYPE "public"."order_item_snapshot_source" AS ENUM('PRODUCT', 'IMPORT', 'MANUAL', 'API');--> statement-breakpoint
CREATE TYPE "public"."order_item_status" AS ENUM('PENDING', 'CONFIRMED', 'ALLOCATED', 'PICKING', 'PACKED', 'READY_FOR_SHIPMENT', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURN_APPROVED', 'RETURN_REJECTED', 'RETURN_RECEIVED', 'REFUND_PENDING', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."order_item_tax_type" AS ENUM('NONE', 'GST', 'IGST', 'CGST_SGST', 'VAT', 'CUSTOM');--> statement-breakpoint
CREATE TYPE "public"."order_status_action" AS ENUM('CREATED', 'UPDATED', 'ACCEPTED', 'REJECTED', 'PACKED', 'READY_FOR_SHIPMENT', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURN_APPROVED', 'RETURN_REJECTED', 'RETURN_RECEIVED', 'REFUND_INITIATED', 'REFUNDED', 'RESTORED', 'ARCHIVED', 'SYSTEM_UPDATE');--> statement-breakpoint
CREATE TYPE "public"."order_status_result" AS ENUM('SUCCESS', 'FAILED', 'ROLLED_BACK');--> statement-breakpoint
CREATE TYPE "public"."order_status_source" AS ENUM('BUYER', 'SELLER', 'ADMIN', 'SYSTEM', 'PAYMENT_GATEWAY', 'DELIVERY_PARTNER', 'API', 'CRON', 'WEBHOOK');--> statement-breakpoint
CREATE TYPE "public"."courier_partner" AS ENUM('DELHIVERY', 'BLUEDART', 'DTDC', 'EKART', 'XPRESSBEES', 'EKOM', 'INDIA_POST', 'SHADOWFAX', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."delivery_attempt_status" AS ENUM('NOT_ATTEMPTED', 'ATTEMPTED', 'FAILED', 'RESCHEDULED', 'DELIVERED');--> statement-breakpoint
CREATE TYPE "public"."manifest_status" AS ENUM('NOT_CREATED', 'CREATED', 'PRINTED', 'HANDED_OVER');--> statement-breakpoint
CREATE TYPE "public"."package_type" AS ENUM('BOX', 'POLY_BAG', 'ENVELOPE', 'CUSTOM');--> statement-breakpoint
CREATE TYPE "public"."shipment_method" AS ENUM('STANDARD', 'EXPRESS', 'SAME_DAY', 'NEXT_DAY', 'STORE_PICKUP');--> statement-breakpoint
CREATE TYPE "public"."shipment_type" AS ENUM('FULL_ORDER', 'PARTIAL_ORDER', 'REPLACEMENT', 'EXCHANGE', 'RETURN');--> statement-breakpoint
CREATE TYPE "public"."shipping_label_status" AS ENUM('NOT_GENERATED', 'GENERATED', 'PRINTED', 'VOIDED');--> statement-breakpoint
CREATE TYPE "public"."order_return_approval_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'AUTO_APPROVED');--> statement-breakpoint
CREATE TYPE "public"."order_return_condition" AS ENUM('SEALED', 'UNUSED', 'USED', 'DAMAGED', 'DEFECTIVE', 'MISSING_PARTS', 'NOT_RESELLABLE');--> statement-breakpoint
CREATE TYPE "public"."order_return_inspection_result" AS ENUM('PENDING', 'PASSED', 'FAILED', 'PARTIALLY_ACCEPTED');--> statement-breakpoint
CREATE TYPE "public"."order_return_pickup_status" AS ENUM('NOT_REQUIRED', 'PENDING', 'SCHEDULED', 'PICKED_UP', 'FAILED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."order_return_reason" AS ENUM('DAMAGED_PRODUCT', 'DEFECTIVE_PRODUCT', 'WRONG_PRODUCT', 'WRONG_SIZE', 'MISSING_ITEMS', 'QUALITY_NOT_AS_EXPECTED', 'NOT_AS_DESCRIBED', 'COLOR_MISMATCH', 'DUPLICATE_ORDER', 'ORDERED_BY_MISTAKE', 'LATE_DELIVERY', 'DELIVERED_AFTER_EVENT', 'NO_LONGER_NEEDED', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."order_return_refund_status" AS ENUM('NOT_APPLICABLE', 'PENDING', 'INITIATED', 'PROCESSING', 'COMPLETED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."order_return_replacement_status" AS ENUM('NOT_APPLICABLE', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."order_return_status" AS ENUM('REQUESTED', 'APPROVED', 'REJECTED', 'AWAITING_PICKUP', 'PICKED_UP', 'IN_TRANSIT', 'RECEIVED', 'INSPECTING', 'APPROVED_FOR_REFUND', 'REFUND_INITIATED', 'REFUNDED', 'REPLACEMENT_INITIATED', 'REPLACED', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."order_return_type" AS ENUM('RETURN_AND_REFUND', 'RETURN_AND_REPLACE', 'RETURN_AND_EXCHANGE', 'RETURN_ONLY');--> statement-breakpoint
CREATE TYPE "public"."order_refund_approval_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'AUTO_APPROVED');--> statement-breakpoint
CREATE TYPE "public"."order_refund_gateway" AS ENUM('NONE', 'RAZORPAY', 'STRIPE', 'PHONEPE', 'PAYU', 'CASHFREE', 'CCAVENUE', 'OFFLINE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."order_refund_method" AS ENUM('ORIGINAL_PAYMENT_METHOD', 'BANK_TRANSFER', 'UPI', 'WALLET', 'STORE_CREDIT', 'MANUAL');--> statement-breakpoint
CREATE TYPE "public"."order_refund_reason" AS ENUM('RETURN_APPROVED', 'ORDER_CANCELLED', 'PAYMENT_FAILED', 'PAYMENT_DUPLICATE', 'DAMAGED_PRODUCT', 'DEFECTIVE_PRODUCT', 'WRONG_PRODUCT', 'MISSING_ITEMS', 'PRICE_ADJUSTMENT', 'CUSTOMER_REQUEST', 'SELLER_APPROVED', 'ADMIN_APPROVED', 'FRAUD_REVERSAL', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."order_refund_status" AS ENUM('PENDING', 'INITIATED', 'PROCESSING', 'APPROVED', 'REJECTED', 'SUCCESS', 'FAILED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."order_refund_type" AS ENUM('FULL', 'PARTIAL', 'SHIPPING_ONLY', 'ITEM_ONLY', 'GOODWILL', 'ADJUSTMENT');--> statement-breakpoint
CREATE TYPE "public"."payment_capture_status" AS ENUM('NOT_REQUIRED', 'AUTHORIZED', 'CAPTURED', 'PARTIALLY_CAPTURED', 'FAILED', 'VOIDED');--> statement-breakpoint
CREATE TYPE "public"."payment_failure_category" AS ENUM('CUSTOMER', 'BANK', 'GATEWAY', 'NETWORK', 'SYSTEM', 'UNKNOWN');--> statement-breakpoint
CREATE TYPE "public"."payment_fraud_status" AS ENUM('NOT_CHECKED', 'LOW_RISK', 'MEDIUM_RISK', 'HIGH_RISK', 'BLOCKED');--> statement-breakpoint
CREATE TYPE "public"."order_payment_gateway" AS ENUM('RAZORPAY', 'PHONEPE', 'PAYTM', 'CASHFREE', 'STRIPE', 'COD', 'BANK_TRANSFER', 'UPI', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."payment_mode" AS ENUM('ONLINE', 'OFFLINE');--> statement-breakpoint
CREATE TYPE "public"."payment_transaction_type" AS ENUM('PAYMENT', 'PARTIAL_PAYMENT', 'CAPTURE', 'REFUND', 'PARTIAL_REFUND', 'REVERSAL', 'VOID', 'CHARGEBACK', 'CHARGEBACK_REVERSAL');--> statement-breakpoint
CREATE TYPE "public"."payment_verification_status" AS ENUM('PENDING', 'VERIFIED', 'FAILED', 'MANUAL_REVIEW');--> statement-breakpoint
CREATE TYPE "public"."settlement_status" AS ENUM('PENDING', 'PROCESSING', 'SETTLED', 'FAILED');--> statement-breakpoint
ALTER TYPE "public"."catalog_status" ADD VALUE 'ARCHIVED';--> statement-breakpoint
ALTER TYPE "public"."product_type" ADD VALUE 'GIFT_CARD';--> statement-breakpoint
CREATE TABLE "pricing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"currency_code" varchar(3) DEFAULT 'INR' NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"compare_at_price" numeric(12, 2),
	"cost_price" numeric(12, 2),
	"minimum_advertised_price" numeric(12, 2),
	"effective_from" timestamp with time zone,
	"effective_until" timestamp with time zone,
	"is_tax_inclusive" boolean DEFAULT true NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "pricing_price_check" CHECK ("pricing"."price" >= 0),
	CONSTRAINT "pricing_compare_at_price_check" CHECK ("pricing"."compare_at_price" IS NULL
        OR "pricing"."compare_at_price" >= 0),
	CONSTRAINT "pricing_cost_price_check" CHECK ("pricing"."cost_price" IS NULL
        OR "pricing"."cost_price" >= 0),
	CONSTRAINT "pricing_minimum_advertised_price_check" CHECK ("pricing"."minimum_advertised_price" IS NULL
        OR "pricing"."minimum_advertised_price" >= 0),
	CONSTRAINT "pricing_effective_period_check" CHECK ("pricing"."effective_until" IS NULL
        OR "pricing"."effective_from" IS NULL
        OR "pricing"."effective_until" >= "pricing"."effective_from")
);
--> statement-breakpoint
CREATE TABLE "product_ai" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"summary" varchar(2000),
	"seo_title" varchar(255),
	"seo_description" varchar(500),
	"generated_tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"generated_attributes" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"embedding" jsonb,
	"quality_score" integer DEFAULT 0 NOT NULL,
	"search_score" integer DEFAULT 0 NOT NULL,
	"completeness_score" integer DEFAULT 0 NOT NULL,
	"moderation_status" "ai_moderation_status" DEFAULT 'PENDING' NOT NULL,
	"moderation_reason" varchar(1000),
	"last_model" varchar(100),
	"last_generated_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_ai_summary_not_empty_check" CHECK ("product_ai"."summary" IS NULL
        OR length(trim("product_ai"."summary")) > 0),
	CONSTRAINT "product_ai_seo_title_not_empty_check" CHECK ("product_ai"."seo_title" IS NULL
        OR length(trim("product_ai"."seo_title")) > 0),
	CONSTRAINT "product_ai_seo_description_not_empty_check" CHECK ("product_ai"."seo_description" IS NULL
        OR length(trim("product_ai"."seo_description")) > 0),
	CONSTRAINT "product_ai_moderation_reason_not_empty_check" CHECK ("product_ai"."moderation_reason" IS NULL
        OR length(trim("product_ai"."moderation_reason")) > 0),
	CONSTRAINT "product_ai_last_model_not_empty_check" CHECK ("product_ai"."last_model" IS NULL
        OR length(trim("product_ai"."last_model")) > 0),
	CONSTRAINT "product_ai_quality_score_check" CHECK ("product_ai"."quality_score" >= 0
        AND "product_ai"."quality_score" <= 100),
	CONSTRAINT "product_ai_search_score_check" CHECK ("product_ai"."search_score" >= 0
        AND "product_ai"."search_score" <= 100),
	CONSTRAINT "product_ai_completeness_score_check" CHECK ("product_ai"."completeness_score" >= 0
        AND "product_ai"."completeness_score" <= 100)
);
--> statement-breakpoint
CREATE TABLE "product_attribute_values" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"attribute_id" uuid NOT NULL,
	"attribute_option_id" uuid,
	"value_text" text,
	"value_number" numeric(18, 4),
	"value_boolean" boolean,
	"value_date" date,
	"value_json" jsonb,
	"display_value" varchar(255),
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "product_attribute_values_product_id_check" CHECK ("product_attribute_values"."product_id" IS NOT NULL),
	CONSTRAINT "product_attribute_values_attribute_id_check" CHECK ("product_attribute_values"."attribute_id" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "product_seo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"slug" varchar(255) NOT NULL,
	"meta_title" varchar(60),
	"meta_description" varchar(160),
	"meta_keywords" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"canonical_url" varchar(2048),
	"robots" "robots_directive" DEFAULT 'INDEX_FOLLOW' NOT NULL,
	"og_title" varchar(60),
	"og_description" varchar(160),
	"og_image" varchar(2048),
	"twitter_title" varchar(60),
	"twitter_description" varchar(160),
	"twitter_image" varchar(2048),
	"structured_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "product_seo_slug_not_empty_check" CHECK (length(trim("product_seo"."slug")) > 0),
	CONSTRAINT "product_seo_meta_title_not_empty_check" CHECK ("product_seo"."meta_title" IS NULL
        OR length(trim("product_seo"."meta_title")) > 0),
	CONSTRAINT "product_seo_meta_description_not_empty_check" CHECK ("product_seo"."meta_description" IS NULL
        OR length(trim("product_seo"."meta_description")) > 0),
	CONSTRAINT "product_seo_canonical_url_not_empty_check" CHECK ("product_seo"."canonical_url" IS NULL
        OR length(trim("product_seo"."canonical_url")) > 0)
);
--> statement-breakpoint
CREATE TABLE "product_tag_mappings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_tag_mappings_product_id_not_empty_check" CHECK (length(trim("product_tag_mappings"."product_id"::text)) > 0),
	CONSTRAINT "product_tag_mappings_tag_id_not_empty_check" CHECK (length(trim("product_tag_mappings"."tag_id"::text)) > 0)
);
--> statement-breakpoint
CREATE TABLE "product_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"description" varchar(500),
	"color" varchar(30),
	"icon" varchar(100),
	"is_system" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "product_tags_name_not_empty_check" CHECK (length(trim("product_tags"."name")) > 0),
	CONSTRAINT "product_tags_slug_not_empty_check" CHECK (length(trim("product_tags"."slug")) > 0),
	CONSTRAINT "product_tags_description_not_empty_check" CHECK ("product_tags"."description" IS NULL
        OR length(trim("product_tags"."description")) > 0),
	CONSTRAINT "product_tags_color_not_empty_check" CHECK ("product_tags"."color" IS NULL
        OR length(trim("product_tags"."color")) > 0),
	CONSTRAINT "product_tags_icon_not_empty_check" CHECK ("product_tags"."icon" IS NULL
        OR length(trim("product_tags"."icon")) > 0),
	CONSTRAINT "product_tags_sort_order_check" CHECK ("product_tags"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "product_videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"storage_provider" "product_video_storage_provider" DEFAULT 'SUPABASE' NOT NULL,
	"storage_path" varchar(2048) NOT NULL,
	"video_url" varchar(2048) NOT NULL,
	"thumbnail_url" varchar(2048),
	"file_name" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"file_size" bigint NOT NULL,
	"checksum" varchar(128) NOT NULL,
	"duration_seconds" bigint NOT NULL,
	"width" bigint NOT NULL,
	"height" bigint NOT NULL,
	"title" varchar(255),
	"description" varchar(2000),
	"display_order" integer DEFAULT 0 NOT NULL,
	"video_type" "product_video_type" DEFAULT 'GALLERY' NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"status" "product_video_status" DEFAULT 'ACTIVE' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "product_videos_width_check" CHECK ("product_videos"."width" > 0),
	CONSTRAINT "product_videos_height_check" CHECK ("product_videos"."height" > 0),
	CONSTRAINT "product_videos_duration_check" CHECK ("product_videos"."duration_seconds" > 0),
	CONSTRAINT "product_videos_file_size_check" CHECK ("product_videos"."file_size" > 0),
	CONSTRAINT "product_videos_display_order_check" CHECK ("product_videos"."display_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "shipping" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"weight" numeric(10, 3),
	"weight_unit" "weight_unit" DEFAULT 'KG' NOT NULL,
	"length" numeric(10, 2),
	"width" numeric(10, 2),
	"height" numeric(10, 2),
	"dimension_unit" "dimension_unit" DEFAULT 'CM' NOT NULL,
	"requires_shipping" boolean DEFAULT true NOT NULL,
	"is_free_shipping" boolean DEFAULT false NOT NULL,
	"shipping_class" "shipping_class" DEFAULT 'STANDARD' NOT NULL,
	"is_fragile" boolean DEFAULT false NOT NULL,
	"is_hazardous" boolean DEFAULT false NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "shipping_weight_check" CHECK ("shipping"."weight" IS NULL
        OR "shipping"."weight" >= 0),
	CONSTRAINT "shipping_length_check" CHECK ("shipping"."length" IS NULL
        OR "shipping"."length" >= 0),
	CONSTRAINT "shipping_width_check" CHECK ("shipping"."width" IS NULL
        OR "shipping"."width" >= 0),
	CONSTRAINT "shipping_height_check" CHECK ("shipping"."height" IS NULL
        OR "shipping"."height" >= 0)
);
--> statement-breakpoint
CREATE TABLE "order_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"changed_by_user_id" uuid,
	"from_status" "order_status",
	"to_status" "order_status" NOT NULL,
	"action" "order_status_action" NOT NULL,
	"source" "order_status_source" DEFAULT 'SYSTEM' NOT NULL,
	"result" "order_status_result" DEFAULT 'SUCCESS' NOT NULL,
	"reason" varchar(1000),
	"remarks" text,
	"reference_id" varchar(255),
	"ip_address" varchar(45),
	"user_agent" text,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_shipments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"shipment_number" varchar(100) NOT NULL,
	"shipment_status" "shipment_status" DEFAULT 'PENDING' NOT NULL,
	"shipping_method" "shipment_method" DEFAULT 'STANDARD' NOT NULL,
	"carrier" "courier_partner" DEFAULT 'OTHER' NOT NULL,
	"carrier_name" varchar(150),
	"tracking_number" varchar(255),
	"tracking_url" text,
	"reference_number" varchar(255),
	"package_count" integer DEFAULT 1 NOT NULL,
	"total_weight" numeric(10, 3),
	"length" numeric(10, 2),
	"width" numeric(10, 2),
	"height" numeric(10, 2),
	"packed_at" timestamp with time zone,
	"dispatched_at" timestamp with time zone,
	"in_transit_at" timestamp with time zone,
	"out_for_delivery_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"failed_at" timestamp with time zone,
	"returned_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"notes" text,
	"internal_notes" text,
	"estimated_delivery_date" timestamp with time zone,
	"actual_delivery_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "order_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"payment_number" varchar(100) NOT NULL,
	"payment_status" "settlement_status" DEFAULT 'PENDING' NOT NULL,
	"payment_method" "payment_mode" NOT NULL,
	"payment_gateway" "order_payment_gateway" NOT NULL,
	"currency" varchar(10) DEFAULT 'INR' NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"gateway_fee" numeric(18, 2),
	"platform_fee" numeric(18, 2),
	"tax_amount" numeric(18, 2),
	"net_amount" numeric(18, 2) NOT NULL,
	"transaction_id" varchar(255),
	"gateway_payment_id" varchar(255),
	"gateway_order_id" varchar(255),
	"gateway_reference_id" varchar(255),
	"gateway_signature" text,
	"initiated_at" timestamp with time zone,
	"authorized_at" timestamp with time zone,
	"paid_at" timestamp with time zone,
	"captured_at" timestamp with time zone,
	"failed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"expired_at" timestamp with time zone,
	"payer_name" varchar(255),
	"payer_email" varchar(320),
	"payer_phone" varchar(20),
	"failure_reason" text,
	"gateway_response" jsonb,
	"notes" text,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "order_returns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"order_item_id" uuid,
	"shipment_id" uuid,
	"payment_id" uuid,
	"seller_id" uuid NOT NULL,
	"return_number" varchar(100) NOT NULL,
	"return_status" "order_return_status" DEFAULT 'REQUESTED' NOT NULL,
	"return_type" "order_return_type" NOT NULL,
	"return_reason" "order_return_reason" NOT NULL,
	"approval_status" "order_return_approval_status" DEFAULT 'PENDING' NOT NULL,
	"refund_status" "order_return_refund_status" DEFAULT 'NOT_APPLICABLE' NOT NULL,
	"replacement_status" "order_return_replacement_status" DEFAULT 'NOT_APPLICABLE' NOT NULL,
	"customer_remarks" text,
	"seller_remarks" text,
	"admin_remarks" text,
	"pickup_status" "order_return_pickup_status" DEFAULT 'NOT_REQUIRED' NOT NULL,
	"pickup_address" text,
	"pickup_tracking_number" varchar(150),
	"pickup_reference_number" varchar(150),
	"courier_partner" varchar(120),
	"pickup_scheduled_at" timestamp with time zone,
	"picked_up_at" timestamp with time zone,
	"inspection_result" "order_return_inspection_result" DEFAULT 'PENDING' NOT NULL,
	"return_condition" "order_return_condition",
	"inspection_notes" text,
	"inspected_by" uuid,
	"inspected_at" timestamp with time zone,
	"refund_amount" numeric(18, 2),
	"replacement_order_id" uuid,
	"replacement_shipment_id" uuid,
	"image_urls" jsonb,
	"video_urls" jsonb,
	"attachment_urls" jsonb,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"approved_at" timestamp with time zone,
	"rejected_at" timestamp with time zone,
	"received_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "order_refunds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"order_return_id" uuid,
	"payment_id" uuid,
	"seller_id" uuid NOT NULL,
	"refund_number" varchar(100) NOT NULL,
	"refund_status" "order_refund_status" DEFAULT 'PENDING' NOT NULL,
	"refund_type" "order_refund_type" NOT NULL,
	"refund_reason" "order_refund_reason" NOT NULL,
	"approval_status" "order_refund_approval_status" DEFAULT 'PENDING' NOT NULL,
	"refund_method" "order_refund_method" NOT NULL,
	"refund_gateway" "order_refund_gateway" DEFAULT 'NONE' NOT NULL,
	"refund_amount" numeric(18, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'INR' NOT NULL,
	"exchange_rate" numeric(18, 8),
	"gateway_fee" numeric(18, 2),
	"processing_fee" numeric(18, 2),
	"tax_amount" numeric(18, 2),
	"net_refund_amount" numeric(18, 2),
	"transaction_id" varchar(255),
	"gateway_payment_id" varchar(255),
	"gateway_refund_id" varchar(255),
	"gateway_reference_id" varchar(255),
	"gateway_response" jsonb,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"max_retry_count" integer DEFAULT 3 NOT NULL,
	"next_retry_at" timestamp with time zone,
	"last_retry_at" timestamp with time zone,
	"failure_reason" text,
	"approved_by" uuid,
	"approval_remarks" text,
	"initiated_at" timestamp with time zone,
	"approved_at" timestamp with time zone,
	"processed_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"failed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"webhook_received_at" timestamp with time zone,
	"webhook_payload" jsonb,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "cart_items" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "coupons" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "filter_groups" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "filter_options" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "heroItems" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "order_status" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "orders" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ordered_items" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "order_notes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payment_events" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "product_category" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "product_filter_options" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "product_items" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "productReview" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "inventory_transactions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "rewards_schema" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "subcatSearch" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "update_schema" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_address" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_view_history" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wishlist_items" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "cart_items" CASCADE;--> statement-breakpoint
DROP TABLE "coupons" CASCADE;--> statement-breakpoint
DROP TABLE "filter_groups" CASCADE;--> statement-breakpoint
DROP TABLE "filter_options" CASCADE;--> statement-breakpoint
DROP TABLE "heroItems" CASCADE;--> statement-breakpoint
DROP TABLE "order_status" CASCADE;--> statement-breakpoint
DROP TABLE "orders" CASCADE;--> statement-breakpoint
DROP TABLE "ordered_items" CASCADE;--> statement-breakpoint
DROP TABLE "order_notes" CASCADE;--> statement-breakpoint
DROP TABLE "payment_events" CASCADE;--> statement-breakpoint
DROP TABLE "payments" CASCADE;--> statement-breakpoint
DROP TABLE "product_category" CASCADE;--> statement-breakpoint
DROP TABLE "product_filter_options" CASCADE;--> statement-breakpoint
DROP TABLE "product_items" CASCADE;--> statement-breakpoint
DROP TABLE "productReview" CASCADE;--> statement-breakpoint
DROP TABLE "inventory_transactions" CASCADE;--> statement-breakpoint
DROP TABLE "rewards_schema" CASCADE;--> statement-breakpoint
DROP TABLE "subcatSearch" CASCADE;--> statement-breakpoint
DROP TABLE "update_schema" CASCADE;--> statement-breakpoint
DROP TABLE "user_address" CASCADE;--> statement-breakpoint
DROP TABLE "user_view_history" CASCADE;--> statement-breakpoint
DROP TABLE "wishlist_items" CASCADE;--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_parent_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_order_id_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_product_id_product_items_id_fk";
--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_rating_productReview_id_fk";
--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_order_status_order_status_id_fk";
--> statement-breakpoint
ALTER TABLE "product_media" DROP CONSTRAINT "product_media_variant_id_product_variants_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_brand_id_brands_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_order_item_id_ordered_items_id_fk";
--> statement-breakpoint
ALTER TABLE "category_attributes" ALTER COLUMN "input_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."attribute_input_type";--> statement-breakpoint
CREATE TYPE "public"."attribute_input_type" AS ENUM('TEXT', 'TEXTAREA', 'NUMBER', 'DECIMAL', 'BOOLEAN', 'DATE', 'SELECT', 'MULTI_SELECT');--> statement-breakpoint
ALTER TABLE "category_attributes" ALTER COLUMN "input_type" SET DATA TYPE "public"."attribute_input_type" USING "input_type"::"public"."attribute_input_type";--> statement-breakpoint
ALTER TABLE "shipment_orders" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "shipment_orders" ALTER COLUMN "status" SET DEFAULT 'PENDING'::text;--> statement-breakpoint
ALTER TABLE "order_shipments" ALTER COLUMN "shipment_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "order_shipments" ALTER COLUMN "shipment_status" SET DEFAULT 'PENDING'::text;--> statement-breakpoint
DROP TYPE "public"."shipment_status";--> statement-breakpoint
CREATE TYPE "public"."shipment_status" AS ENUM('PENDING', 'READY_TO_SHIP', 'LABEL_GENERATED', 'MANIFEST_GENERATED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELIVERY_FAILED', 'RETURN_TO_ORIGIN', 'RETURNED', 'CANCELLED');--> statement-breakpoint
ALTER TABLE "shipment_orders" ALTER COLUMN "status" SET DEFAULT 'PENDING'::"public"."shipment_status";--> statement-breakpoint
ALTER TABLE "shipment_orders" ALTER COLUMN "status" SET DATA TYPE "public"."shipment_status" USING "status"::"public"."shipment_status";--> statement-breakpoint
ALTER TABLE "order_shipments" ALTER COLUMN "shipment_status" SET DEFAULT 'PENDING'::"public"."shipment_status";--> statement-breakpoint
ALTER TABLE "order_shipments" ALTER COLUMN "shipment_status" SET DATA TYPE "public"."shipment_status" USING "shipment_status"::"public"."shipment_status";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "status" SET DEFAULT 'DRAFT'::text;--> statement-breakpoint
DROP TYPE "public"."product_status";--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('DRAFT', 'PENDING_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'PUBLISHED', 'SUSPENDED', 'REJECTED', 'ARCHIVED');--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "status" SET DEFAULT 'DRAFT'::"public"."product_status";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "status" SET DATA TYPE "public"."product_status" USING "status"::"public"."product_status";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "visibility" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "visibility" SET DEFAULT 'PRIVATE'::text;--> statement-breakpoint
DROP TYPE "public"."product_visibility";--> statement-breakpoint
CREATE TYPE "public"."product_visibility" AS ENUM('PUBLIC', 'PRIVATE', 'UNLISTED');--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "visibility" SET DEFAULT 'PRIVATE'::"public"."product_visibility";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "visibility" SET DATA TYPE "public"."product_visibility" USING "visibility"::"public"."product_visibility";--> statement-breakpoint
DROP INDEX "cat_attr_category_slug_idx";--> statement-breakpoint
DROP INDEX "cat_attr_options_val_idx";--> statement-breakpoint
DROP INDEX "orders_number_uniq_idx";--> statement-breakpoint
DROP INDEX "orders_buyer_lookup_idx";--> statement-breakpoint
DROP INDEX "orders_seller_lookup_idx";--> statement-breakpoint
DROP INDEX "orders_status_lookup_idx";--> statement-breakpoint
DROP INDEX "inventory_variant_uniq_idx";--> statement-breakpoint
DROP INDEX "prod_media_product_idx";--> statement-breakpoint
DROP INDEX "prod_media_variant_idx";--> statement-breakpoint
DROP INDEX "product_variants_barcode_idx";--> statement-breakpoint
DROP INDEX "products_slug_idx";--> statement-breakpoint
DROP INDEX "products_seller_idx";--> statement-breakpoint
DROP INDEX "products_status_idx";--> statement-breakpoint
DROP INDEX "variant_attr_uniq_idx";--> statement-breakpoint
DROP INDEX "variant_attr_option_idx";--> statement-breakpoint
DROP INDEX "product_variants_sku_idx";--> statement-breakpoint
DROP INDEX "product_variants_product_idx";--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "name" SET DATA TYPE varchar(150);--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "slug" SET DATA TYPE varchar(180);--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "level" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "category_attributes" ALTER COLUMN "name" SET DATA TYPE varchar(150);--> statement-breakpoint
ALTER TABLE "category_attributes" ALTER COLUMN "slug" SET DATA TYPE varchar(180);--> statement-breakpoint
ALTER TABLE "category_attributes" ALTER COLUMN "is_filterable" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "category_attributes" ALTER COLUMN "helper_text" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "category_attribute_options" ALTER COLUMN "label" SET DATA TYPE varchar(150);--> statement-breakpoint
ALTER TABLE "category_attribute_options" ALTER COLUMN "value" SET DATA TYPE varchar(150);--> statement-breakpoint
ALTER TABLE "category_attribute_options" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "category_attribute_options" ALTER COLUMN "metadata" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "quantity" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "product_orders" ALTER COLUMN "order_number" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "product_orders" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "product_orders" ALTER COLUMN "status" SET DATA TYPE "public"."order_status" USING "status"::text::"public"."order_status";--> statement-breakpoint
ALTER TABLE "product_orders" ALTER COLUMN "status" SET DEFAULT 'PENDING';--> statement-breakpoint
ALTER TABLE "product_orders" ALTER COLUMN "currency" SET DATA TYPE varchar(10);--> statement-breakpoint
ALTER TABLE "product_orders" ALTER COLUMN "currency" SET DEFAULT 'INR';--> statement-breakpoint
ALTER TABLE "product_orders" ALTER COLUMN "subtotal" SET DATA TYPE numeric(18, 2);--> statement-breakpoint
ALTER TABLE "product_orders" ALTER COLUMN "discount_amount" SET DATA TYPE numeric(18, 2);--> statement-breakpoint
ALTER TABLE "product_orders" ALTER COLUMN "discount_amount" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "inventory" ALTER COLUMN "reserved_quantity" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "inventory" ALTER COLUMN "low_stock_threshold" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "inventory" ALTER COLUMN "low_stock_threshold" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "inventory" ALTER COLUMN "allow_backorder" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product_media" ALTER COLUMN "storage_key" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "product_media" ALTER COLUMN "storage_key" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product_media" ALTER COLUMN "cdn_url" SET DATA TYPE varchar(2048);--> statement-breakpoint
ALTER TABLE "product_media" ALTER COLUMN "media_type" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "product_media" ALTER COLUMN "media_type" SET DEFAULT 'IMAGE';--> statement-breakpoint
ALTER TABLE "product_media" ALTER COLUMN "media_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product_media" ALTER COLUMN "alt_text" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "product_media" ALTER COLUMN "display_order" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product_media" ALTER COLUMN "is_primary" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product_media" ALTER COLUMN "status" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "product_media" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';--> statement-breakpoint
ALTER TABLE "product_media" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "sku" SET DATA TYPE varchar(120);--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "barcode" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "price" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "price" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "compare_at_price" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "cost_price" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "status" SET DATA TYPE "public"."product_variant_status" USING "status"::text::"public"."product_variant_status";--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "seller_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "short_description" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "description" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "is_featured" DROP NOT NULL;--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'seller_store'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "seller_store" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "seller_store" ALTER COLUMN "seller_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "code" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "path" text NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "is_leaf" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "status" "catalog_status" DEFAULT 'ACTIVE' NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "visibility" "category_visibility" DEFAULT 'PUBLIC' NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "is_visible" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "created_by" uuid;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "updated_by" uuid;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "category_attributes" ADD COLUMN "attribute_key" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "category_attributes" ADD COLUMN "description" varchar(1000);--> statement-breakpoint
ALTER TABLE "category_attributes" ADD COLUMN "data_type" "attribute_data_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "category_attributes" ADD COLUMN "is_searchable" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "category_attributes" ADD COLUMN "is_comparable" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "category_attributes" ADD COLUMN "system_defined" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "category_attributes" ADD COLUMN "status" "catalog_status" DEFAULT 'ACTIVE' NOT NULL;--> statement-breakpoint
ALTER TABLE "category_attributes" ADD COLUMN "show_on_listing" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "category_attributes" ADD COLUMN "placeholder" varchar(255);--> statement-breakpoint
ALTER TABLE "category_attributes" ADD COLUMN "unit" varchar(50);--> statement-breakpoint
ALTER TABLE "category_attributes" ADD COLUMN "attribute_group" varchar(100);--> statement-breakpoint
ALTER TABLE "category_attributes" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "category_attributes" ADD COLUMN "created_by" uuid;--> statement-breakpoint
ALTER TABLE "category_attributes" ADD COLUMN "updated_by" uuid;--> statement-breakpoint
ALTER TABLE "category_attributes" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "category_attribute_options" ADD COLUMN "description" varchar(1000);--> statement-breakpoint
ALTER TABLE "category_attribute_options" ADD COLUMN "image_url" varchar(2048);--> statement-breakpoint
ALTER TABLE "category_attribute_options" ADD COLUMN "icon_url" varchar(2048);--> statement-breakpoint
ALTER TABLE "category_attribute_options" ADD COLUMN "is_default" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "category_attribute_options" ADD COLUMN "system_defined" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "category_attribute_options" ADD COLUMN "status" "catalog_status" DEFAULT 'ACTIVE' NOT NULL;--> statement-breakpoint
ALTER TABLE "category_attribute_options" ADD COLUMN "created_by" uuid;--> statement-breakpoint
ALTER TABLE "category_attribute_options" ADD COLUMN "updated_by" uuid;--> statement-breakpoint
ALTER TABLE "category_attribute_options" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "seller_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "variant_id" uuid;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "sku" varchar(120) NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "variant_sku" varchar(120);--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "product_slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "product_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "variant_name" varchar(255);--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "brand_name" varchar(150);--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "category_name" varchar(150);--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "thumbnail_url" text;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "snapshot_source" "order_item_snapshot_source" DEFAULT 'PRODUCT' NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "currency" varchar(3) DEFAULT 'INR' NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "unit_price" numeric(12, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "compare_at_price" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "discount_type" "order_item_discount_type" DEFAULT 'NONE' NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "discount_amount" numeric(12, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "tax_type" "order_item_tax_type" DEFAULT 'NONE' NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "tax_rate" numeric(5, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "tax_amount" numeric(12, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "subtotal" numeric(12, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "total" numeric(12, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "weight" numeric(10, 3);--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "length" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "width" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "height" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "inventory_location" varchar(255);--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "warehouse_name" varchar(255);--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "fulfillment_type" "order_item_fulfillment_type" DEFAULT 'STANDARD' NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "item_status" "order_item_status" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "seller_sku" varchar(120);--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "store_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "shipping_address_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "billing_address_id" uuid;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "payment_status" "order_payment_status" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "payment_method" "order_payment_method" DEFAULT 'COD' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "shipping_method" "shipping_method" DEFAULT 'STANDARD' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "priority" "order_priority" DEFAULT 'NORMAL' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "source" "order_source" DEFAULT 'WEB' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "buyer_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "buyer_email" varchar(320) NOT NULL;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "buyer_phone" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "coupon_discount" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "shipping_charge" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "tax_amount" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "grand_total" numeric(18, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "is_gift" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "gift_message" text;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "requires_signature" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "seller_remark" text;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "internal_remark" text;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "expected_delivery_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "actual_delivery_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "accepted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "packed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "ready_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "shipped_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "delivered_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "returned_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "product_orders" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "variant_attributes" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "variant_attributes" ADD COLUMN "created_by" uuid;--> statement-breakpoint
ALTER TABLE "variant_attributes" ADD COLUMN "updated_by" uuid;--> statement-breakpoint
ALTER TABLE "variant_attributes" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "variant_attributes" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "seller_store" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "seller_store" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pricing" ADD CONSTRAINT "pricing_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pricing" ADD CONSTRAINT "pricing_created_by_seller_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pricing" ADD CONSTRAINT "pricing_updated_by_seller_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_ai" ADD CONSTRAINT "product_ai_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_ai" ADD CONSTRAINT "product_ai_created_by_seller_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_ai" ADD CONSTRAINT "product_ai_updated_by_seller_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_attribute_id_category_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."category_attributes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_attribute_option_id_category_attribute_options_id_fk" FOREIGN KEY ("attribute_option_id") REFERENCES "public"."category_attribute_options"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_created_by_seller_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_updated_by_seller_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_seo" ADD CONSTRAINT "product_seo_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_seo" ADD CONSTRAINT "product_seo_created_by_seller_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_seo" ADD CONSTRAINT "product_seo_updated_by_seller_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_tag_mappings" ADD CONSTRAINT "product_tag_mappings_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_tag_mappings" ADD CONSTRAINT "product_tag_mappings_tag_id_product_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."product_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_tag_mappings" ADD CONSTRAINT "product_tag_mappings_created_by_seller_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_created_by_seller_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_updated_by_seller_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_videos" ADD CONSTRAINT "product_videos_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_videos" ADD CONSTRAINT "product_videos_created_by_seller_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_videos" ADD CONSTRAINT "product_videos_updated_by_seller_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping" ADD CONSTRAINT "shipping_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping" ADD CONSTRAINT "shipping_created_by_seller_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping" ADD CONSTRAINT "shipping_updated_by_seller_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_changed_by_user_id_users_id_fk" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_shipments" ADD CONSTRAINT "order_shipments_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_shipments" ADD CONSTRAINT "order_shipments_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_payments" ADD CONSTRAINT "order_payments_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_payments" ADD CONSTRAINT "order_payments_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_returns" ADD CONSTRAINT "order_returns_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_returns" ADD CONSTRAINT "order_returns_order_item_id_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_returns" ADD CONSTRAINT "order_returns_shipment_id_order_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."order_shipments"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_returns" ADD CONSTRAINT "order_returns_payment_id_order_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."order_payments"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_returns" ADD CONSTRAINT "order_returns_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_returns" ADD CONSTRAINT "order_returns_replacement_order_id_product_orders_id_fk" FOREIGN KEY ("replacement_order_id") REFERENCES "public"."product_orders"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_returns" ADD CONSTRAINT "order_returns_replacement_shipment_id_order_shipments_id_fk" FOREIGN KEY ("replacement_shipment_id") REFERENCES "public"."order_shipments"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_refunds" ADD CONSTRAINT "order_refunds_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_refunds" ADD CONSTRAINT "order_refunds_order_return_id_order_returns_id_fk" FOREIGN KEY ("order_return_id") REFERENCES "public"."order_returns"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_refunds" ADD CONSTRAINT "order_refunds_payment_id_order_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."order_payments"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_refunds" ADD CONSTRAINT "order_refunds_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "pricing_variant_uidx" ON "pricing" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "pricing_variant_idx" ON "pricing" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "pricing_currency_code_idx" ON "pricing" USING btree ("currency_code");--> statement-breakpoint
CREATE INDEX "pricing_price_idx" ON "pricing" USING btree ("price");--> statement-breakpoint
CREATE INDEX "pricing_effective_from_idx" ON "pricing" USING btree ("effective_from");--> statement-breakpoint
CREATE INDEX "pricing_effective_until_idx" ON "pricing" USING btree ("effective_until");--> statement-breakpoint
CREATE INDEX "pricing_created_by_idx" ON "pricing" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "pricing_updated_by_idx" ON "pricing" USING btree ("updated_by");--> statement-breakpoint
CREATE INDEX "pricing_created_at_idx" ON "pricing" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "pricing_deleted_at_idx" ON "pricing" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "product_ai_product_uidx" ON "product_ai" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_ai_product_idx" ON "product_ai" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_ai_moderation_status_idx" ON "product_ai" USING btree ("moderation_status");--> statement-breakpoint
CREATE INDEX "product_ai_quality_score_idx" ON "product_ai" USING btree ("quality_score");--> statement-breakpoint
CREATE INDEX "product_ai_search_score_idx" ON "product_ai" USING btree ("search_score");--> statement-breakpoint
CREATE INDEX "product_ai_completeness_score_idx" ON "product_ai" USING btree ("completeness_score");--> statement-breakpoint
CREATE INDEX "product_ai_last_generated_at_idx" ON "product_ai" USING btree ("last_generated_at");--> statement-breakpoint
CREATE INDEX "product_ai_created_by_idx" ON "product_ai" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "product_ai_updated_by_idx" ON "product_ai" USING btree ("updated_by");--> statement-breakpoint
CREATE INDEX "product_ai_created_at_idx" ON "product_ai" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "product_ai_updated_at_idx" ON "product_ai" USING btree ("updated_at");--> statement-breakpoint
CREATE UNIQUE INDEX "product_attribute_values_product_attribute_uidx" ON "product_attribute_values" USING btree ("product_id","attribute_id");--> statement-breakpoint
CREATE INDEX "product_attribute_values_product_idx" ON "product_attribute_values" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_attribute_values_attribute_idx" ON "product_attribute_values" USING btree ("attribute_id");--> statement-breakpoint
CREATE INDEX "product_attribute_values_attribute_option_idx" ON "product_attribute_values" USING btree ("attribute_option_id");--> statement-breakpoint
CREATE INDEX "product_attribute_values_product_attribute_idx" ON "product_attribute_values" USING btree ("product_id","attribute_id");--> statement-breakpoint
CREATE INDEX "product_attribute_values_option_lookup_idx" ON "product_attribute_values" USING btree ("attribute_option_id","product_id");--> statement-breakpoint
CREATE INDEX "product_attribute_values_value_text_idx" ON "product_attribute_values" USING btree ("value_text");--> statement-breakpoint
CREATE INDEX "product_attribute_values_value_number_idx" ON "product_attribute_values" USING btree ("value_number");--> statement-breakpoint
CREATE INDEX "product_attribute_values_value_boolean_idx" ON "product_attribute_values" USING btree ("value_boolean");--> statement-breakpoint
CREATE INDEX "product_attribute_values_value_date_idx" ON "product_attribute_values" USING btree ("value_date");--> statement-breakpoint
CREATE INDEX "product_attribute_values_created_by_idx" ON "product_attribute_values" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "product_attribute_values_updated_by_idx" ON "product_attribute_values" USING btree ("updated_by");--> statement-breakpoint
CREATE INDEX "product_attribute_values_created_at_idx" ON "product_attribute_values" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "product_attribute_values_deleted_at_idx" ON "product_attribute_values" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "product_seo_product_uidx" ON "product_seo" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "product_seo_slug_uidx" ON "product_seo" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "product_seo_product_idx" ON "product_seo" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_seo_slug_idx" ON "product_seo" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "product_seo_robots_idx" ON "product_seo" USING btree ("robots");--> statement-breakpoint
CREATE INDEX "product_seo_created_by_idx" ON "product_seo" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "product_seo_updated_by_idx" ON "product_seo" USING btree ("updated_by");--> statement-breakpoint
CREATE INDEX "product_seo_created_at_idx" ON "product_seo" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "product_seo_deleted_at_idx" ON "product_seo" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "product_tag_mappings_product_tag_uidx" ON "product_tag_mappings" USING btree ("product_id","tag_id");--> statement-breakpoint
CREATE INDEX "product_tag_mappings_product_idx" ON "product_tag_mappings" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_tag_mappings_tag_idx" ON "product_tag_mappings" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "product_tag_mappings_created_by_idx" ON "product_tag_mappings" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "product_tag_mappings_created_at_idx" ON "product_tag_mappings" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "product_tags_name_uidx" ON "product_tags" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "product_tags_slug_uidx" ON "product_tags" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "product_tags_name_idx" ON "product_tags" USING btree ("name");--> statement-breakpoint
CREATE INDEX "product_tags_slug_idx" ON "product_tags" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "product_tags_featured_idx" ON "product_tags" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "product_tags_system_idx" ON "product_tags" USING btree ("is_system");--> statement-breakpoint
CREATE INDEX "product_tags_sort_order_idx" ON "product_tags" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "product_tags_created_by_idx" ON "product_tags" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "product_tags_updated_by_idx" ON "product_tags" USING btree ("updated_by");--> statement-breakpoint
CREATE INDEX "product_tags_created_at_idx" ON "product_tags" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "product_tags_deleted_at_idx" ON "product_tags" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "product_videos_storage_path_uidx" ON "product_videos" USING btree ("storage_path");--> statement-breakpoint
CREATE UNIQUE INDEX "product_videos_product_checksum_uidx" ON "product_videos" USING btree ("product_id","checksum");--> statement-breakpoint
CREATE INDEX "product_videos_product_idx" ON "product_videos" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_videos_product_display_order_idx" ON "product_videos" USING btree ("product_id","display_order");--> statement-breakpoint
CREATE INDEX "product_videos_product_status_idx" ON "product_videos" USING btree ("product_id","status");--> statement-breakpoint
CREATE INDEX "product_videos_product_video_type_idx" ON "product_videos" USING btree ("product_id","video_type");--> statement-breakpoint
CREATE INDEX "product_videos_primary_idx" ON "product_videos" USING btree ("product_id","is_primary");--> statement-breakpoint
CREATE INDEX "product_videos_storage_provider_idx" ON "product_videos" USING btree ("storage_provider");--> statement-breakpoint
CREATE INDEX "product_videos_created_by_idx" ON "product_videos" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "product_videos_updated_by_idx" ON "product_videos" USING btree ("updated_by");--> statement-breakpoint
CREATE INDEX "product_videos_created_at_idx" ON "product_videos" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "product_videos_deleted_at_idx" ON "product_videos" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "shipping_variant_uidx" ON "shipping" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "shipping_variant_idx" ON "shipping" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "shipping_requires_shipping_idx" ON "shipping" USING btree ("requires_shipping");--> statement-breakpoint
CREATE INDEX "shipping_is_free_shipping_idx" ON "shipping" USING btree ("is_free_shipping");--> statement-breakpoint
CREATE INDEX "shipping_shipping_class_idx" ON "shipping" USING btree ("shipping_class");--> statement-breakpoint
CREATE INDEX "shipping_is_fragile_idx" ON "shipping" USING btree ("is_fragile");--> statement-breakpoint
CREATE INDEX "shipping_is_hazardous_idx" ON "shipping" USING btree ("is_hazardous");--> statement-breakpoint
CREATE INDEX "shipping_created_by_idx" ON "shipping" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "shipping_updated_by_idx" ON "shipping" USING btree ("updated_by");--> statement-breakpoint
CREATE INDEX "shipping_created_at_idx" ON "shipping" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "shipping_deleted_at_idx" ON "shipping" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "order_status_history_order_idx" ON "order_status_history" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_status_history_seller_idx" ON "order_status_history" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "order_status_history_changed_by_user_idx" ON "order_status_history" USING btree ("changed_by_user_id");--> statement-breakpoint
CREATE INDEX "order_status_history_order_seller_idx" ON "order_status_history" USING btree ("order_id","seller_id");--> statement-breakpoint
CREATE INDEX "order_status_history_from_status_idx" ON "order_status_history" USING btree ("from_status");--> statement-breakpoint
CREATE INDEX "order_status_history_to_status_idx" ON "order_status_history" USING btree ("to_status");--> statement-breakpoint
CREATE INDEX "order_status_history_action_idx" ON "order_status_history" USING btree ("action");--> statement-breakpoint
CREATE INDEX "order_status_history_source_idx" ON "order_status_history" USING btree ("source");--> statement-breakpoint
CREATE INDEX "order_status_history_result_idx" ON "order_status_history" USING btree ("result");--> statement-breakpoint
CREATE INDEX "order_status_history_order_transition_idx" ON "order_status_history" USING btree ("order_id","to_status");--> statement-breakpoint
CREATE INDEX "order_status_history_seller_transition_idx" ON "order_status_history" USING btree ("seller_id","to_status");--> statement-breakpoint
CREATE INDEX "order_status_history_action_source_idx" ON "order_status_history" USING btree ("action","source");--> statement-breakpoint
CREATE INDEX "order_status_history_changed_at_idx" ON "order_status_history" USING btree ("changed_at");--> statement-breakpoint
CREATE INDEX "order_status_history_created_at_idx" ON "order_status_history" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "order_status_history_order_timeline_idx" ON "order_status_history" USING btree ("order_id","changed_at");--> statement-breakpoint
CREATE INDEX "order_status_history_seller_timeline_idx" ON "order_status_history" USING btree ("seller_id","changed_at");--> statement-breakpoint
CREATE INDEX "order_status_history_changed_by_timeline_idx" ON "order_status_history" USING btree ("changed_by_user_id","changed_at");--> statement-breakpoint
CREATE INDEX "order_status_history_latest_status_idx" ON "order_status_history" USING btree ("order_id","changed_at","to_status");--> statement-breakpoint
CREATE INDEX "order_status_history_seller_status_timeline_idx" ON "order_status_history" USING btree ("seller_id","to_status","changed_at");--> statement-breakpoint
CREATE INDEX "order_status_history_action_timeline_idx" ON "order_status_history" USING btree ("action","changed_at");--> statement-breakpoint
CREATE INDEX "order_status_history_source_timeline_idx" ON "order_status_history" USING btree ("source","changed_at");--> statement-breakpoint
CREATE INDEX "order_status_history_audit_lookup_idx" ON "order_status_history" USING btree ("order_id","action","changed_at");--> statement-breakpoint
CREATE INDEX "order_shipments_shipment_number_idx" ON "order_shipments" USING btree ("shipment_number");--> statement-breakpoint
CREATE INDEX "order_shipments_status_idx" ON "order_shipments" USING btree ("shipment_status");--> statement-breakpoint
CREATE INDEX "order_shipments_shipping_method_idx" ON "order_shipments" USING btree ("shipping_method");--> statement-breakpoint
CREATE INDEX "order_shipments_carrier_idx" ON "order_shipments" USING btree ("carrier");--> statement-breakpoint
CREATE INDEX "order_shipments_carrier_name_idx" ON "order_shipments" USING btree ("carrier_name");--> statement-breakpoint
CREATE INDEX "order_shipments_tracking_number_idx" ON "order_shipments" USING btree ("tracking_number");--> statement-breakpoint
CREATE INDEX "order_shipments_reference_number_idx" ON "order_shipments" USING btree ("reference_number");--> statement-breakpoint
CREATE INDEX "order_shipments_order_status_idx" ON "order_shipments" USING btree ("order_id","shipment_status");--> statement-breakpoint
CREATE INDEX "order_shipments_seller_status_idx" ON "order_shipments" USING btree ("seller_id","shipment_status");--> statement-breakpoint
CREATE INDEX "order_shipments_order_number_idx" ON "order_shipments" USING btree ("order_id","shipment_number");--> statement-breakpoint
CREATE INDEX "order_shipments_order_idx" ON "order_shipments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_shipments_seller_idx" ON "order_shipments" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "order_shipments_order_seller_idx" ON "order_shipments" USING btree ("order_id","seller_id");--> statement-breakpoint
CREATE INDEX "order_shipments_estimated_delivery_idx" ON "order_shipments" USING btree ("estimated_delivery_date");--> statement-breakpoint
CREATE INDEX "order_shipments_actual_delivery_idx" ON "order_shipments" USING btree ("actual_delivery_date");--> statement-breakpoint
CREATE INDEX "order_shipments_created_at_idx" ON "order_shipments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "order_shipments_updated_at_idx" ON "order_shipments" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "order_shipments_deleted_at_idx" ON "order_shipments" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "order_shipments_seller_dashboard_idx" ON "order_shipments" USING btree ("seller_id","shipment_status","created_at");--> statement-breakpoint
CREATE INDEX "order_shipments_seller_delivery_idx" ON "order_shipments" USING btree ("seller_id","actual_delivery_date");--> statement-breakpoint
CREATE INDEX "order_shipments_order_detail_idx" ON "order_shipments" USING btree ("order_id","created_at");--> statement-breakpoint
CREATE INDEX "order_shipments_carrier_tracking_idx" ON "order_shipments" USING btree ("carrier","tracking_number");--> statement-breakpoint
CREATE INDEX "order_shipments_carrier_delivery_idx" ON "order_shipments" USING btree ("carrier","shipment_status","actual_delivery_date");--> statement-breakpoint
CREATE INDEX "order_shipments_search_idx" ON "order_shipments" USING btree ("shipment_number","tracking_number");--> statement-breakpoint
CREATE INDEX "order_shipments_active_idx" ON "order_shipments" USING btree ("deleted_at","shipment_status");--> statement-breakpoint
CREATE INDEX "order_payments_order_idx" ON "order_payments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_payments_seller_idx" ON "order_payments" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "order_payments_order_seller_idx" ON "order_payments" USING btree ("order_id","seller_id");--> statement-breakpoint
CREATE INDEX "order_payments_payment_number_idx" ON "order_payments" USING btree ("payment_number");--> statement-breakpoint
CREATE INDEX "order_payments_status_idx" ON "order_payments" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "order_payments_method_idx" ON "order_payments" USING btree ("payment_method");--> statement-breakpoint
CREATE INDEX "order_payments_gateway_idx" ON "order_payments" USING btree ("payment_gateway");--> statement-breakpoint
CREATE INDEX "order_payments_currency_idx" ON "order_payments" USING btree ("currency");--> statement-breakpoint
CREATE INDEX "order_payments_amount_idx" ON "order_payments" USING btree ("amount");--> statement-breakpoint
CREATE INDEX "order_payments_net_amount_idx" ON "order_payments" USING btree ("net_amount");--> statement-breakpoint
CREATE INDEX "order_payments_seller_status_idx" ON "order_payments" USING btree ("seller_id","payment_status");--> statement-breakpoint
CREATE INDEX "order_payments_order_status_idx" ON "order_payments" USING btree ("order_id","payment_status");--> statement-breakpoint
CREATE INDEX "order_payments_order_number_idx" ON "order_payments" USING btree ("order_id","payment_number");--> statement-breakpoint
CREATE INDEX "order_payments_gateway_status_idx" ON "order_payments" USING btree ("payment_gateway","payment_status");--> statement-breakpoint
CREATE INDEX "order_payments_initiated_at_idx" ON "order_payments" USING btree ("initiated_at");--> statement-breakpoint
CREATE INDEX "order_payments_authorized_at_idx" ON "order_payments" USING btree ("authorized_at");--> statement-breakpoint
CREATE INDEX "order_payments_paid_at_idx" ON "order_payments" USING btree ("paid_at");--> statement-breakpoint
CREATE INDEX "order_payments_captured_at_idx" ON "order_payments" USING btree ("captured_at");--> statement-breakpoint
CREATE INDEX "order_payments_failed_at_idx" ON "order_payments" USING btree ("failed_at");--> statement-breakpoint
CREATE INDEX "order_payments_cancelled_at_idx" ON "order_payments" USING btree ("cancelled_at");--> statement-breakpoint
CREATE INDEX "order_payments_expired_at_idx" ON "order_payments" USING btree ("expired_at");--> statement-breakpoint
CREATE INDEX "order_payments_seller_timeline_idx" ON "order_payments" USING btree ("seller_id","payment_status","paid_at");--> statement-breakpoint
CREATE INDEX "order_payments_order_timeline_idx" ON "order_payments" USING btree ("order_id","payment_status","paid_at");--> statement-breakpoint
CREATE INDEX "order_payments_revenue_timeline_idx" ON "order_payments" USING btree ("payment_status","captured_at");--> statement-breakpoint
CREATE INDEX "order_payments_settlement_timeline_idx" ON "order_payments" USING btree ("payment_gateway","captured_at");--> statement-breakpoint
CREATE INDEX "order_payments_failed_timeline_idx" ON "order_payments" USING btree ("payment_status","failed_at");--> statement-breakpoint
CREATE INDEX "order_payments_expired_timeline_idx" ON "order_payments" USING btree ("payment_status","expired_at");--> statement-breakpoint
CREATE INDEX "order_payments_payer_email_idx" ON "order_payments" USING btree ("payer_email");--> statement-breakpoint
CREATE INDEX "order_payments_payer_phone_idx" ON "order_payments" USING btree ("payer_phone");--> statement-breakpoint
CREATE INDEX "order_payments_gateway_failure_idx" ON "order_payments" USING btree ("payment_gateway","failure_reason");--> statement-breakpoint
CREATE INDEX "order_payments_created_at_idx" ON "order_payments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "order_payments_updated_at_idx" ON "order_payments" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "order_payments_deleted_at_idx" ON "order_payments" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "order_payments_seller_dashboard_idx" ON "order_payments" USING btree ("seller_id","payment_status","created_at");--> statement-breakpoint
CREATE INDEX "order_payments_order_detail_idx" ON "order_payments" USING btree ("order_id","created_at");--> statement-breakpoint
CREATE INDEX "order_payments_revenue_report_idx" ON "order_payments" USING btree ("payment_status","amount","created_at");--> statement-breakpoint
CREATE INDEX "order_payments_settlement_idx" ON "order_payments" USING btree ("payment_gateway","payment_status","captured_at");--> statement-breakpoint
CREATE INDEX "order_payments_refund_lookup_idx" ON "order_payments" USING btree ("order_id","payment_status","transaction_id");--> statement-breakpoint
CREATE INDEX "order_payments_reconciliation_idx" ON "order_payments" USING btree ("payment_gateway","gateway_payment_id","transaction_id");--> statement-breakpoint
CREATE INDEX "order_payments_active_idx" ON "order_payments" USING btree ("deleted_at","payment_status");--> statement-breakpoint
CREATE INDEX "order_returns_order_idx" ON "order_returns" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_returns_order_item_idx" ON "order_returns" USING btree ("order_item_id");--> statement-breakpoint
CREATE INDEX "order_returns_shipment_idx" ON "order_returns" USING btree ("shipment_id");--> statement-breakpoint
CREATE INDEX "order_returns_payment_idx" ON "order_returns" USING btree ("payment_id");--> statement-breakpoint
CREATE INDEX "order_returns_seller_idx" ON "order_returns" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "order_returns_order_seller_idx" ON "order_returns" USING btree ("order_id","seller_id");--> statement-breakpoint
CREATE INDEX "order_returns_item_seller_idx" ON "order_returns" USING btree ("order_item_id","seller_id");--> statement-breakpoint
CREATE INDEX "order_returns_shipment_seller_idx" ON "order_returns" USING btree ("shipment_id","seller_id");--> statement-breakpoint
CREATE INDEX "order_returns_return_number_idx" ON "order_returns" USING btree ("return_number");--> statement-breakpoint
CREATE INDEX "order_returns_status_idx" ON "order_returns" USING btree ("return_status");--> statement-breakpoint
CREATE INDEX "order_returns_type_idx" ON "order_returns" USING btree ("return_type");--> statement-breakpoint
CREATE INDEX "order_returns_reason_idx" ON "order_returns" USING btree ("return_reason");--> statement-breakpoint
CREATE INDEX "order_returns_approval_status_idx" ON "order_returns" USING btree ("approval_status");--> statement-breakpoint
CREATE INDEX "order_returns_refund_status_idx" ON "order_returns" USING btree ("refund_status");--> statement-breakpoint
CREATE INDEX "order_returns_replacement_status_idx" ON "order_returns" USING btree ("replacement_status");--> statement-breakpoint
CREATE INDEX "order_returns_seller_status_idx" ON "order_returns" USING btree ("seller_id","return_status");--> statement-breakpoint
CREATE INDEX "order_returns_seller_approval_idx" ON "order_returns" USING btree ("seller_id","approval_status");--> statement-breakpoint
CREATE INDEX "order_returns_order_status_idx" ON "order_returns" USING btree ("order_id","return_status");--> statement-breakpoint
CREATE INDEX "order_returns_order_number_idx" ON "order_returns" USING btree ("order_id","return_number");--> statement-breakpoint
CREATE INDEX "order_returns_approval_workflow_idx" ON "order_returns" USING btree ("approval_status","return_status");--> statement-breakpoint
CREATE INDEX "order_returns_refund_workflow_idx" ON "order_returns" USING btree ("refund_status","return_status");--> statement-breakpoint
CREATE INDEX "order_returns_replacement_workflow_idx" ON "order_returns" USING btree ("replacement_status","return_status");--> statement-breakpoint
CREATE INDEX "order_returns_pickup_status_idx" ON "order_returns" USING btree ("pickup_status");--> statement-breakpoint
CREATE INDEX "order_returns_pickup_tracking_idx" ON "order_returns" USING btree ("pickup_tracking_number");--> statement-breakpoint
CREATE INDEX "order_returns_pickup_reference_idx" ON "order_returns" USING btree ("pickup_reference_number");--> statement-breakpoint
CREATE INDEX "order_returns_courier_partner_idx" ON "order_returns" USING btree ("courier_partner");--> statement-breakpoint
CREATE INDEX "order_returns_pickup_scheduled_idx" ON "order_returns" USING btree ("pickup_scheduled_at");--> statement-breakpoint
CREATE INDEX "order_returns_picked_up_idx" ON "order_returns" USING btree ("picked_up_at");--> statement-breakpoint
CREATE INDEX "order_returns_seller_pickup_idx" ON "order_returns" USING btree ("seller_id","pickup_status");--> statement-breakpoint
CREATE INDEX "order_returns_courier_pickup_idx" ON "order_returns" USING btree ("courier_partner","pickup_status");--> statement-breakpoint
CREATE INDEX "order_returns_pickup_workflow_idx" ON "order_returns" USING btree ("pickup_status","pickup_scheduled_at");--> statement-breakpoint
CREATE INDEX "order_returns_tracking_lookup_idx" ON "order_returns" USING btree ("courier_partner","pickup_tracking_number");--> statement-breakpoint
CREATE INDEX "order_returns_inspection_result_idx" ON "order_returns" USING btree ("inspection_result");--> statement-breakpoint
CREATE INDEX "order_returns_condition_idx" ON "order_returns" USING btree ("return_condition");--> statement-breakpoint
CREATE INDEX "order_returns_inspected_by_idx" ON "order_returns" USING btree ("inspected_by");--> statement-breakpoint
CREATE INDEX "order_returns_inspected_at_idx" ON "order_returns" USING btree ("inspected_at");--> statement-breakpoint
CREATE INDEX "order_returns_refund_amount_idx" ON "order_returns" USING btree ("refund_amount");--> statement-breakpoint
CREATE INDEX "order_returns_replacement_order_idx" ON "order_returns" USING btree ("replacement_order_id");--> statement-breakpoint
CREATE INDEX "order_returns_replacement_shipment_idx" ON "order_returns" USING btree ("replacement_shipment_id");--> statement-breakpoint
CREATE INDEX "order_returns_warehouse_idx" ON "order_returns" USING btree ("inspection_result","inspected_at");--> statement-breakpoint
CREATE INDEX "order_returns_resolution_idx" ON "order_returns" USING btree ("refund_status","replacement_status");--> statement-breakpoint
CREATE INDEX "order_returns_seller_resolution_idx" ON "order_returns" USING btree ("seller_id","refund_status","replacement_status");--> statement-breakpoint
CREATE INDEX "order_refunds_order_idx" ON "order_refunds" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_refunds_return_idx" ON "order_refunds" USING btree ("order_return_id");--> statement-breakpoint
CREATE INDEX "order_refunds_payment_idx" ON "order_refunds" USING btree ("payment_id");--> statement-breakpoint
CREATE INDEX "order_refunds_seller_idx" ON "order_refunds" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "order_refunds_seller_order_idx" ON "order_refunds" USING btree ("seller_id","order_id");--> statement-breakpoint
CREATE INDEX "order_refunds_order_payment_idx" ON "order_refunds" USING btree ("order_id","payment_id");--> statement-breakpoint
CREATE INDEX "order_refunds_return_seller_idx" ON "order_refunds" USING btree ("order_return_id","seller_id");--> statement-breakpoint
CREATE INDEX "order_refunds_refund_number_idx" ON "order_refunds" USING btree ("refund_number");--> statement-breakpoint
CREATE INDEX "order_refunds_status_idx" ON "order_refunds" USING btree ("refund_status");--> statement-breakpoint
CREATE INDEX "order_refunds_type_idx" ON "order_refunds" USING btree ("refund_type");--> statement-breakpoint
CREATE INDEX "order_refunds_reason_idx" ON "order_refunds" USING btree ("refund_reason");--> statement-breakpoint
CREATE INDEX "order_refunds_approval_status_idx" ON "order_refunds" USING btree ("approval_status");--> statement-breakpoint
CREATE INDEX "order_refunds_method_idx" ON "order_refunds" USING btree ("refund_method");--> statement-breakpoint
CREATE INDEX "order_refunds_gateway_idx" ON "order_refunds" USING btree ("refund_gateway");--> statement-breakpoint
CREATE INDEX "order_refunds_seller_status_idx" ON "order_refunds" USING btree ("seller_id","refund_status");--> statement-breakpoint
CREATE INDEX "order_refunds_seller_approval_idx" ON "order_refunds" USING btree ("seller_id","approval_status");--> statement-breakpoint
CREATE INDEX "order_refunds_order_status_idx" ON "order_refunds" USING btree ("order_id","refund_status");--> statement-breakpoint
CREATE INDEX "order_refunds_order_number_idx" ON "order_refunds" USING btree ("order_id","refund_number");--> statement-breakpoint
CREATE INDEX "order_refunds_approval_workflow_idx" ON "order_refunds" USING btree ("approval_status","refund_status");--> statement-breakpoint
CREATE INDEX "order_refunds_gateway_workflow_idx" ON "order_refunds" USING btree ("refund_gateway","refund_status");--> statement-breakpoint
CREATE INDEX "order_refunds_method_workflow_idx" ON "order_refunds" USING btree ("refund_method","refund_status");--> statement-breakpoint
CREATE INDEX "order_refunds_amount_idx" ON "order_refunds" USING btree ("refund_amount");--> statement-breakpoint
CREATE INDEX "order_refunds_currency_idx" ON "order_refunds" USING btree ("currency");--> statement-breakpoint
CREATE INDEX "order_refunds_net_amount_idx" ON "order_refunds" USING btree ("net_refund_amount");--> statement-breakpoint
CREATE INDEX "order_refunds_transaction_idx" ON "order_refunds" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "order_refunds_gateway_payment_idx" ON "order_refunds" USING btree ("gateway_payment_id");--> statement-breakpoint
CREATE INDEX "order_refunds_gateway_refund_idx" ON "order_refunds" USING btree ("gateway_refund_id");--> statement-breakpoint
CREATE INDEX "order_refunds_gateway_reference_idx" ON "order_refunds" USING btree ("gateway_reference_id");--> statement-breakpoint
CREATE INDEX "order_refunds_financial_dashboard_idx" ON "order_refunds" USING btree ("refund_status","refund_amount");--> statement-breakpoint
CREATE INDEX "order_refunds_gateway_dashboard_idx" ON "order_refunds" USING btree ("refund_gateway","refund_status");--> statement-breakpoint
CREATE INDEX "order_refunds_gateway_transaction_idx" ON "order_refunds" USING btree ("refund_gateway","transaction_id");--> statement-breakpoint
CREATE INDEX "order_refunds_seller_financial_idx" ON "order_refunds" USING btree ("seller_id","refund_status","refund_amount");--> statement-breakpoint
CREATE INDEX "order_refunds_reconciliation_idx" ON "order_refunds" USING btree ("gateway_payment_id","gateway_refund_id");--> statement-breakpoint
CREATE INDEX "order_refunds_retry_count_idx" ON "order_refunds" USING btree ("retry_count");--> statement-breakpoint
CREATE INDEX "order_refunds_next_retry_idx" ON "order_refunds" USING btree ("next_retry_at");--> statement-breakpoint
CREATE INDEX "order_refunds_last_retry_idx" ON "order_refunds" USING btree ("last_retry_at");--> statement-breakpoint
CREATE INDEX "order_refunds_approved_by_idx" ON "order_refunds" USING btree ("approved_by");--> statement-breakpoint
CREATE INDEX "order_refunds_initiated_at_idx" ON "order_refunds" USING btree ("initiated_at");--> statement-breakpoint
CREATE INDEX "order_refunds_approved_at_idx" ON "order_refunds" USING btree ("approved_at");--> statement-breakpoint
CREATE INDEX "order_refunds_processed_at_idx" ON "order_refunds" USING btree ("processed_at");--> statement-breakpoint
CREATE INDEX "order_refunds_completed_at_idx" ON "order_refunds" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "order_refunds_failed_at_idx" ON "order_refunds" USING btree ("failed_at");--> statement-breakpoint
CREATE INDEX "order_refunds_cancelled_at_idx" ON "order_refunds" USING btree ("cancelled_at");--> statement-breakpoint
CREATE INDEX "order_refunds_retry_queue_idx" ON "order_refunds" USING btree ("refund_status","next_retry_at");--> statement-breakpoint
CREATE INDEX "order_refunds_approval_queue_idx" ON "order_refunds" USING btree ("approval_status","created_at");--> statement-breakpoint
CREATE INDEX "order_refunds_processing_queue_idx" ON "order_refunds" USING btree ("refund_gateway","refund_status","processed_at");--> statement-breakpoint
CREATE INDEX "order_refunds_timeline_idx" ON "order_refunds" USING btree ("refund_status","initiated_at","completed_at");--> statement-breakpoint
CREATE INDEX "order_refunds_failed_dashboard_idx" ON "order_refunds" USING btree ("refund_status","failed_at");--> statement-breakpoint
CREATE INDEX "order_refunds_webhook_idx" ON "order_refunds" USING btree ("webhook_received_at");--> statement-breakpoint
CREATE INDEX "order_refunds_created_at_idx" ON "order_refunds" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "order_refunds_updated_at_idx" ON "order_refunds" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "order_refunds_deleted_at_idx" ON "order_refunds" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "order_refunds_dashboard_idx" ON "order_refunds" USING btree ("seller_id","refund_status","created_at");--> statement-breakpoint
CREATE INDEX "order_refunds_seller_timeline_idx" ON "order_refunds" USING btree ("seller_id","completed_at");--> statement-breakpoint
CREATE INDEX "order_refunds_financial_analytics_idx" ON "order_refunds" USING btree ("refund_status","refund_amount","completed_at");--> statement-breakpoint
CREATE INDEX "order_refunds_type_analytics_idx" ON "order_refunds" USING btree ("refund_type","completed_at");--> statement-breakpoint
CREATE INDEX "order_refunds_gateway_analytics_idx" ON "order_refunds" USING btree ("refund_gateway","completed_at");--> statement-breakpoint
CREATE INDEX "order_refunds_method_analytics_idx" ON "order_refunds" USING btree ("refund_method","completed_at");--> statement-breakpoint
CREATE INDEX "order_refunds_reconciliation_dashboard_idx" ON "order_refunds" USING btree ("gateway_payment_id","gateway_refund_id","completed_at");--> statement-breakpoint
CREATE INDEX "order_refunds_order_dashboard_idx" ON "order_refunds" USING btree ("order_id","refund_status","created_at");--> statement-breakpoint
CREATE INDEX "order_refunds_return_dashboard_idx" ON "order_refunds" USING btree ("order_return_id","refund_status");--> statement-breakpoint
CREATE INDEX "order_refunds_active_idx" ON "order_refunds" USING btree ("deleted_at","refund_status");--> statement-breakpoint
CREATE INDEX "order_refunds_processing_dashboard_idx" ON "order_refunds" USING btree ("refund_status","approval_status","refund_gateway","created_at");--> statement-breakpoint
CREATE INDEX "order_refunds_monthly_finance_idx" ON "order_refunds" USING btree ("completed_at","refund_amount","currency");--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_created_by_seller_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_updated_by_seller_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_attributes" ADD CONSTRAINT "category_attributes_created_by_seller_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_attributes" ADD CONSTRAINT "category_attributes_updated_by_seller_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_attribute_options" ADD CONSTRAINT "category_attribute_options_created_by_seller_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_attribute_options" ADD CONSTRAINT "category_attribute_options_updated_by_seller_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_orders" ADD CONSTRAINT "product_orders_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_orders" ADD CONSTRAINT "product_orders_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_orders" ADD CONSTRAINT "product_orders_store_id_seller_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."seller_store"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_orders" ADD CONSTRAINT "product_orders_shipping_address_id_seller_addresses_id_fk" FOREIGN KEY ("shipping_address_id") REFERENCES "public"."seller_addresses"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_orders" ADD CONSTRAINT "product_orders_billing_address_id_seller_addresses_id_fk" FOREIGN KEY ("billing_address_id") REFERENCES "public"."seller_addresses"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_seller_id_seller_store_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller_store"("seller_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_attributes" ADD CONSTRAINT "variant_attributes_created_by_seller_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_attributes" ADD CONSTRAINT "variant_attributes_updated_by_seller_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_item_id_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "categories_code_idx" ON "categories" USING btree ("code");--> statement-breakpoint
CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "categories_parent_sort_idx" ON "categories" USING btree ("parent_id","sort_order");--> statement-breakpoint
CREATE INDEX "categories_level_idx" ON "categories" USING btree ("level");--> statement-breakpoint
CREATE INDEX "categories_status_idx" ON "categories" USING btree ("status");--> statement-breakpoint
CREATE INDEX "categories_visibility_idx" ON "categories" USING btree ("visibility");--> statement-breakpoint
CREATE INDEX "categories_featured_sort_idx" ON "categories" USING btree ("is_featured","sort_order");--> statement-breakpoint
CREATE INDEX "categories_visible_idx" ON "categories" USING btree ("is_visible");--> statement-breakpoint
CREATE INDEX "categories_sort_order_idx" ON "categories" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "categories_created_by_idx" ON "categories" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "categories_updated_by_idx" ON "categories" USING btree ("updated_by");--> statement-breakpoint
CREATE INDEX "categories_status_deleted_idx" ON "categories" USING btree ("status","deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "category_attributes_category_attribute_key_uidx" ON "category_attributes" USING btree ("category_id","attribute_key");--> statement-breakpoint
CREATE UNIQUE INDEX "category_attributes_category_slug_uidx" ON "category_attributes" USING btree ("category_id","slug");--> statement-breakpoint
CREATE INDEX "category_attributes_category_idx" ON "category_attributes" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "category_attributes_category_display_order_idx" ON "category_attributes" USING btree ("category_id","display_order");--> statement-breakpoint
CREATE INDEX "category_attributes_category_filterable_idx" ON "category_attributes" USING btree ("category_id","is_filterable");--> statement-breakpoint
CREATE INDEX "category_attributes_category_searchable_idx" ON "category_attributes" USING btree ("category_id","is_searchable");--> statement-breakpoint
CREATE INDEX "category_attributes_category_variant_idx" ON "category_attributes" USING btree ("category_id","is_variant_attribute");--> statement-breakpoint
CREATE INDEX "category_attributes_category_listing_idx" ON "category_attributes" USING btree ("category_id","show_on_listing");--> statement-breakpoint
CREATE INDEX "category_attributes_category_status_deleted_idx" ON "category_attributes" USING btree ("category_id","status","deleted_at");--> statement-breakpoint
CREATE INDEX "category_attributes_created_by_idx" ON "category_attributes" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "category_attributes_updated_by_idx" ON "category_attributes" USING btree ("updated_by");--> statement-breakpoint
CREATE INDEX "category_attributes_deleted_at_idx" ON "category_attributes" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "category_attribute_options_attribute_value_uidx" ON "category_attribute_options" USING btree ("attribute_id","value");--> statement-breakpoint
CREATE UNIQUE INDEX "category_attribute_options_attribute_label_uidx" ON "category_attribute_options" USING btree ("attribute_id","label");--> statement-breakpoint
CREATE INDEX "category_attribute_options_attribute_idx" ON "category_attribute_options" USING btree ("attribute_id");--> statement-breakpoint
CREATE INDEX "category_attribute_options_attribute_display_order_idx" ON "category_attribute_options" USING btree ("attribute_id","display_order");--> statement-breakpoint
CREATE INDEX "category_attribute_options_attribute_status_deleted_idx" ON "category_attribute_options" USING btree ("attribute_id","status","deleted_at");--> statement-breakpoint
CREATE INDEX "category_attribute_options_system_defined_idx" ON "category_attribute_options" USING btree ("system_defined");--> statement-breakpoint
CREATE INDEX "category_attribute_options_default_idx" ON "category_attribute_options" USING btree ("attribute_id","is_default");--> statement-breakpoint
CREATE INDEX "category_attribute_options_created_by_idx" ON "category_attribute_options" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "category_attribute_options_updated_by_idx" ON "category_attribute_options" USING btree ("updated_by");--> statement-breakpoint
CREATE INDEX "category_attribute_options_deleted_at_idx" ON "category_attribute_options" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "order_items_status_idx" ON "order_items" USING btree ("item_status");--> statement-breakpoint
CREATE INDEX "order_items_fulfillment_type_idx" ON "order_items" USING btree ("fulfillment_type");--> statement-breakpoint
CREATE INDEX "order_items_created_at_idx" ON "order_items" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "order_items_deleted_at_idx" ON "order_items" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "order_items_seller_status_created_idx" ON "order_items" USING btree ("seller_id","item_status","created_at");--> statement-breakpoint
CREATE INDEX "order_items_seller_fulfillment_idx" ON "order_items" USING btree ("seller_id","fulfillment_type");--> statement-breakpoint
CREATE INDEX "order_items_order_status_idx" ON "order_items" USING btree ("order_id","item_status");--> statement-breakpoint
CREATE INDEX "order_items_product_status_idx" ON "order_items" USING btree ("product_id","item_status");--> statement-breakpoint
CREATE INDEX "order_items_order_created_idx" ON "order_items" USING btree ("order_id","created_at");--> statement-breakpoint
CREATE INDEX "order_items_seller_sku_idx" ON "order_items" USING btree ("seller_sku");--> statement-breakpoint
CREATE INDEX "order_items_order_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_items_seller_idx" ON "order_items" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "order_items_product_idx" ON "order_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "order_items_variant_idx" ON "order_items" USING btree ("variant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "order_items_order_product_variant_unique_idx" ON "order_items" USING btree ("order_id","product_id","variant_id");--> statement-breakpoint
CREATE INDEX "orders_seller_idx" ON "product_orders" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "orders_buyer_idx" ON "product_orders" USING btree ("buyer_id");--> statement-breakpoint
CREATE INDEX "orders_store_idx" ON "product_orders" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "orders_shipping_address_idx" ON "product_orders" USING btree ("shipping_address_id");--> statement-breakpoint
CREATE INDEX "orders_billing_address_idx" ON "product_orders" USING btree ("billing_address_id");--> statement-breakpoint
CREATE INDEX "orders_seller_store_idx" ON "product_orders" USING btree ("seller_id","store_id");--> statement-breakpoint
CREATE INDEX "orders_buyer_store_idx" ON "product_orders" USING btree ("buyer_id","store_id");--> statement-breakpoint
CREATE INDEX "orders_seller_buyer_idx" ON "product_orders" USING btree ("seller_id","buyer_id");--> statement-breakpoint
CREATE INDEX "orders_order_number_idx" ON "product_orders" USING btree ("order_number");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "product_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "orders_payment_status_idx" ON "product_orders" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "orders_payment_method_idx" ON "product_orders" USING btree ("payment_method");--> statement-breakpoint
CREATE INDEX "orders_shipping_method_idx" ON "product_orders" USING btree ("shipping_method");--> statement-breakpoint
CREATE INDEX "orders_priority_idx" ON "product_orders" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "orders_source_idx" ON "product_orders" USING btree ("source");--> statement-breakpoint
CREATE INDEX "orders_currency_idx" ON "product_orders" USING btree ("currency");--> statement-breakpoint
CREATE INDEX "orders_seller_status_idx" ON "product_orders" USING btree ("seller_id","status");--> statement-breakpoint
CREATE INDEX "orders_seller_payment_status_idx" ON "product_orders" USING btree ("seller_id","payment_status");--> statement-breakpoint
CREATE INDEX "orders_seller_priority_idx" ON "product_orders" USING btree ("seller_id","priority");--> statement-breakpoint
CREATE INDEX "orders_buyer_status_idx" ON "product_orders" USING btree ("buyer_id","status");--> statement-breakpoint
CREATE INDEX "orders_status_priority_idx" ON "product_orders" USING btree ("status","priority");--> statement-breakpoint
CREATE INDEX "orders_payment_workflow_idx" ON "product_orders" USING btree ("payment_status","payment_method");--> statement-breakpoint
CREATE INDEX "orders_shipping_workflow_idx" ON "product_orders" USING btree ("shipping_method","status");--> statement-breakpoint
CREATE INDEX "orders_source_analytics_idx" ON "product_orders" USING btree ("source","status");--> statement-breakpoint
CREATE INDEX "orders_buyer_name_idx" ON "product_orders" USING btree ("buyer_name");--> statement-breakpoint
CREATE INDEX "orders_buyer_email_idx" ON "product_orders" USING btree ("buyer_email");--> statement-breakpoint
CREATE INDEX "orders_buyer_phone_idx" ON "product_orders" USING btree ("buyer_phone");--> statement-breakpoint
CREATE INDEX "orders_subtotal_idx" ON "product_orders" USING btree ("subtotal");--> statement-breakpoint
CREATE INDEX "orders_grand_total_idx" ON "product_orders" USING btree ("grand_total");--> statement-breakpoint
CREATE INDEX "orders_seller_revenue_idx" ON "product_orders" USING btree ("seller_id","grand_total");--> statement-breakpoint
CREATE INDEX "orders_gift_idx" ON "product_orders" USING btree ("is_gift");--> statement-breakpoint
CREATE INDEX "orders_signature_idx" ON "product_orders" USING btree ("requires_signature");--> statement-breakpoint
CREATE INDEX "orders_seller_financial_dashboard_idx" ON "product_orders" USING btree ("seller_id","status","grand_total");--> statement-breakpoint
CREATE INDEX "orders_payment_revenue_idx" ON "product_orders" USING btree ("payment_status","grand_total");--> statement-breakpoint
CREATE INDEX "orders_expected_delivery_idx" ON "product_orders" USING btree ("expected_delivery_date");--> statement-breakpoint
CREATE INDEX "orders_actual_delivery_idx" ON "product_orders" USING btree ("actual_delivery_date");--> statement-breakpoint
CREATE INDEX "orders_accepted_at_idx" ON "product_orders" USING btree ("accepted_at");--> statement-breakpoint
CREATE INDEX "orders_packed_at_idx" ON "product_orders" USING btree ("packed_at");--> statement-breakpoint
CREATE INDEX "orders_ready_at_idx" ON "product_orders" USING btree ("ready_at");--> statement-breakpoint
CREATE INDEX "orders_shipped_at_idx" ON "product_orders" USING btree ("shipped_at");--> statement-breakpoint
CREATE INDEX "orders_delivered_at_idx" ON "product_orders" USING btree ("delivered_at");--> statement-breakpoint
CREATE INDEX "orders_cancelled_at_idx" ON "product_orders" USING btree ("cancelled_at");--> statement-breakpoint
CREATE INDEX "orders_returned_at_idx" ON "product_orders" USING btree ("returned_at");--> statement-breakpoint
CREATE INDEX "orders_seller_timeline_idx" ON "product_orders" USING btree ("seller_id","status","created_at");--> statement-breakpoint
CREATE INDEX "orders_seller_delivery_idx" ON "product_orders" USING btree ("seller_id","expected_delivery_date");--> statement-breakpoint
CREATE INDEX "orders_buyer_timeline_idx" ON "product_orders" USING btree ("buyer_id","status","created_at");--> statement-breakpoint
CREATE INDEX "orders_shipping_queue_idx" ON "product_orders" USING btree ("status","ready_at","shipping_method");--> statement-breakpoint
CREATE INDEX "orders_delivery_queue_idx" ON "product_orders" USING btree ("status","shipped_at");--> statement-breakpoint
CREATE INDEX "orders_delivery_analytics_idx" ON "product_orders" USING btree ("delivered_at","status");--> statement-breakpoint
CREATE INDEX "orders_return_analytics_idx" ON "product_orders" USING btree ("returned_at","status");--> statement-breakpoint
CREATE INDEX "orders_cancellation_analytics_idx" ON "product_orders" USING btree ("cancelled_at","status");--> statement-breakpoint
CREATE INDEX "orders_created_at_idx" ON "product_orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "orders_updated_at_idx" ON "product_orders" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "orders_deleted_at_idx" ON "product_orders" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "orders_seller_dashboard_idx" ON "product_orders" USING btree ("seller_id","status","created_at");--> statement-breakpoint
CREATE INDEX "orders_buyer_dashboard_idx" ON "product_orders" USING btree ("buyer_id","status","created_at");--> statement-breakpoint
CREATE INDEX "orders_store_dashboard_idx" ON "product_orders" USING btree ("store_id","status","created_at");--> statement-breakpoint
CREATE INDEX "orders_revenue_dashboard_idx" ON "product_orders" USING btree ("payment_status","grand_total","created_at");--> statement-breakpoint
CREATE INDEX "orders_seller_revenue_timeline_idx" ON "product_orders" USING btree ("seller_id","payment_status","created_at");--> statement-breakpoint
CREATE INDEX "orders_search_idx" ON "product_orders" USING btree ("order_number","buyer_name");--> statement-breakpoint
CREATE INDEX "orders_lookup_idx" ON "product_orders" USING btree ("order_number","seller_id");--> statement-breakpoint
CREATE INDEX "orders_pending_idx" ON "product_orders" USING btree ("status","priority","created_at");--> statement-breakpoint
CREATE INDEX "orders_processing_idx" ON "product_orders" USING btree ("status","payment_status","created_at");--> statement-breakpoint
CREATE INDEX "orders_financial_analytics_idx" ON "product_orders" USING btree ("created_at","grand_total","currency");--> statement-breakpoint
CREATE INDEX "orders_active_idx" ON "product_orders" USING btree ("deleted_at","status");--> statement-breakpoint
CREATE INDEX "orders_seller_performance_idx" ON "product_orders" USING btree ("seller_id","status","delivered_at");--> statement-breakpoint
CREATE INDEX "orders_buyer_activity_idx" ON "product_orders" USING btree ("buyer_id","created_at");--> statement-breakpoint
CREATE INDEX "orders_store_analytics_idx" ON "product_orders" USING btree ("store_id","created_at");--> statement-breakpoint
CREATE INDEX "orders_monthly_sales_idx" ON "product_orders" USING btree ("created_at","payment_status","grand_total");--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_variant_uidx" ON "inventory" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "inventory_variant_idx" ON "inventory" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "inventory_created_at_idx" ON "inventory" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "product_images_product_idx" ON "product_media" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_images_product_display_order_idx" ON "product_media" USING btree ("product_id","display_order");--> statement-breakpoint
CREATE INDEX "product_images_product_status_idx" ON "product_media" USING btree ("product_id","status");--> statement-breakpoint
CREATE INDEX "product_images_primary_idx" ON "product_media" USING btree ("product_id","is_primary");--> statement-breakpoint
CREATE INDEX "product_images_created_at_idx" ON "product_media" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "product_variants_product_sku_uidx" ON "product_variants" USING btree ("product_id","sku");--> statement-breakpoint
CREATE UNIQUE INDEX "product_variants_barcode_uidx" ON "product_variants" USING btree ("barcode");--> statement-breakpoint
CREATE INDEX "product_variants_product_status_idx" ON "product_variants" USING btree ("product_id","status");--> statement-breakpoint
CREATE INDEX "product_variants_created_at_idx" ON "product_variants" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "product_variants_deleted_at_idx" ON "product_variants" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "products_slug_uidx" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "products_category_listing_idx" ON "products" USING btree ("category_id","visibility","status","created_at");--> statement-breakpoint
CREATE INDEX "products_store_updated_idx" ON "products" USING btree ("seller_id","updated_at");--> statement-breakpoint
CREATE INDEX "products_store_idx" ON "products" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "products_store_status_idx" ON "products" USING btree ("seller_id","status");--> statement-breakpoint
CREATE INDEX "products_visibility_status_idx" ON "products" USING btree ("visibility","status");--> statement-breakpoint
CREATE INDEX "products_category_status_idx" ON "products" USING btree ("category_id","status");--> statement-breakpoint
CREATE INDEX "products_category_visibility_status_idx" ON "products" USING btree ("category_id","visibility","status");--> statement-breakpoint
CREATE INDEX "products_type_status_idx" ON "products" USING btree ("product_type","status");--> statement-breakpoint
CREATE INDEX "products_deleted_at_idx" ON "products" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "product_variant_options_variant_attribute_uidx" ON "variant_attributes" USING btree ("variant_id","attribute_id");--> statement-breakpoint
CREATE INDEX "product_variant_options_variant_idx" ON "variant_attributes" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "product_variant_options_attribute_idx" ON "variant_attributes" USING btree ("attribute_id");--> statement-breakpoint
CREATE INDEX "product_variant_options_attribute_option_idx" ON "variant_attributes" USING btree ("option_id");--> statement-breakpoint
CREATE INDEX "product_variant_options_variant_attribute_idx" ON "variant_attributes" USING btree ("variant_id","attribute_id");--> statement-breakpoint
CREATE INDEX "product_variant_options_option_lookup_idx" ON "variant_attributes" USING btree ("option_id","variant_id");--> statement-breakpoint
CREATE INDEX "product_variant_options_created_by_idx" ON "variant_attributes" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "product_variant_options_updated_by_idx" ON "variant_attributes" USING btree ("updated_by");--> statement-breakpoint
CREATE INDEX "product_variant_options_created_at_idx" ON "variant_attributes" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "product_variant_options_deleted_at_idx" ON "variant_attributes" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "product_variants_sku_idx" ON "product_variants" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "product_variants_product_idx" ON "product_variants" USING btree ("product_id");--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "icon_url";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "banner_url";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "display_order";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "category_attributes" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "category_attribute_options" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN "rating";--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN "price_at_purchase";--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN "invoice";--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN "order_properties";--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN "delivery_date";--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN "order_status";--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN "shipping_charge";--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN "delivery_type";--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "product_orders" DROP COLUMN "delivery_charge";--> statement-breakpoint
ALTER TABLE "product_orders" DROP COLUMN "total_amount";--> statement-breakpoint
ALTER TABLE "product_orders" DROP COLUMN "notes";--> statement-breakpoint
ALTER TABLE "product_orders" DROP COLUMN "placed_at";--> statement-breakpoint
ALTER TABLE "product_orders" DROP COLUMN "confirmed_at";--> statement-breakpoint
ALTER TABLE "product_orders" DROP COLUMN "completed_at";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "brand_id";--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_level_check" CHECK ("categories"."level" >= 0);--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_sort_order_check" CHECK ("categories"."sort_order" >= 0);--> statement-breakpoint
ALTER TABLE "category_attributes" ADD CONSTRAINT "category_attributes_display_order_check" CHECK ("category_attributes"."display_order" >= 0);--> statement-breakpoint
ALTER TABLE "category_attribute_options" ADD CONSTRAINT "category_attribute_options_display_order_check" CHECK ("category_attribute_options"."display_order" >= 0);--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_sku_not_empty_check" CHECK (length(trim("product_variants"."sku")) > 0);--> statement-breakpoint
ALTER TABLE "variant_attributes" ADD CONSTRAINT "product_variant_options_variant_id_check" CHECK ("variant_attributes"."variant_id" IS NOT NULL);--> statement-breakpoint
ALTER TABLE "variant_attributes" ADD CONSTRAINT "product_variant_options_attribute_id_check" CHECK ("variant_attributes"."attribute_id" IS NOT NULL);--> statement-breakpoint
ALTER TABLE "variant_attributes" ADD CONSTRAINT "product_variant_options_attribute_option_id_check" CHECK ("variant_attributes"."option_id" IS NOT NULL);--> statement-breakpoint
DROP TYPE "public"."clothes_status";--> statement-breakpoint
DROP TYPE "public"."delivery_type";--> statement-breakpoint
DROP TYPE "public"."order_note_author_type";--> statement-breakpoint
DROP TYPE "public"."order_note_type";--> statement-breakpoint
DROP TYPE "public"."order_note_visibility";--> statement-breakpoint
DROP TYPE "public"."p_order_status";--> statement-breakpoint
DROP TYPE "public"."payment_event_actor_type";--> statement-breakpoint
DROP TYPE "public"."payment_event_type";--> statement-breakpoint
DROP TYPE "public"."payment_actor_type";--> statement-breakpoint
DROP TYPE "public"."payment_method";--> statement-breakpoint
DROP TYPE "public"."payment_status";--> statement-breakpoint
DROP TYPE "public"."payment_type";--> statement-breakpoint
DROP TYPE "public"."inventory_reference_type";--> statement-breakpoint
DROP TYPE "public"."inventory_transaction_type";--> statement-breakpoint
DROP TYPE "public"."product_media_status";--> statement-breakpoint
DROP TYPE "public"."product_media_type";--> statement-breakpoint
DROP TYPE "public"."variant_status";--> statement-breakpoint
DROP TYPE "public"."status_type";
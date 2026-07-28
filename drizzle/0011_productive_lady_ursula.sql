CREATE TYPE "public"."activity_type" AS ENUM('PRODUCT_CREATED', 'PRODUCT_UPDATED', 'PRODUCT_PUBLISHED', 'PRODUCT_ARCHIVED', 'ORDER_RECEIVED', 'ORDER_ACCEPTED', 'ORDER_COMPLETED', 'MESSAGE_RECEIVED', 'REVIEW_RECEIVED', 'STOCK_UPDATED', 'PROMOTION_CREATED', 'COUPON_CREATED', 'SUBSCRIPTION_STARTED', 'SUBSCRIPTION_RENEWED', 'PROFILE_UPDATED', 'SHOP_UPDATED', 'LOGIN', 'LOGOUT');--> statement-breakpoint
CREATE TYPE "public"."actor_type" AS ENUM('SELLER', 'BUYER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."activity_reference_type" AS ENUM('PRODUCT', 'ORDER', 'REVIEW', 'MESSAGE', 'PROMOTION', 'COUPON', 'SUBSCRIPTION');--> statement-breakpoint
CREATE TYPE "public"."activity_visibility" AS ENUM('PRIVATE', 'TEAM', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."audit_action" AS ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'PASSWORD_CHANGED', 'EMAIL_CHANGED', 'PHONE_CHANGED', 'ORDER_UPDATED', 'ORDER_CANCELLED', 'PRODUCT_UPDATED', 'PRODUCT_DELETED', 'SHOP_UPDATED', 'SUBSCRIPTION_UPDATED', 'ROLE_CHANGED', 'PERMISSION_CHANGED');--> statement-breakpoint
CREATE TYPE "public"."audit_actor_type" AS ENUM('SELLER', 'BUYER', 'ADMIN', 'SYSTEM');--> statement-breakpoint
CREATE TYPE "public"."audit_entity_type" AS ENUM('SELLER', 'BUYER', 'SHOP', 'PRODUCT', 'ORDER', 'ORDER_ITEM', 'MESSAGE', 'REVIEW', 'PROMOTION', 'SUBSCRIPTION', 'PAYMENT', 'DELIVERY');--> statement-breakpoint
CREATE TYPE "public"."catalog_status" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TYPE "public"."attribute_input_type" AS ENUM('TEXT', 'NUMBER', 'SELECT', 'MULTI_SELECT', 'BOOLEAN');--> statement-breakpoint
CREATE TYPE "public"."pickup_status" AS ENUM('REQUESTED', 'SCHEDULED', 'COURIER_ASSIGNED', 'OUT_FOR_PICKUP', 'PICKED_UP', 'FAILED', 'RESCHEDULED', 'CANCELLED', 'ON_HOLD', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."shipment_status" AS ENUM('PENDING', 'READY_FOR_PICKUP', 'PICKUP_SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED_DELIVERY', 'RETURN_INITIATED', 'RETURNED', 'CANCELLED', 'LOST', 'DAMAGED', 'RTO');--> statement-breakpoint
CREATE TYPE "public"."tracking_status" AS ENUM('SHIPMENT_CREATED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'ARRIVED_AT_HUB', 'DEPARTED_HUB', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERY_ATTEMPTED', 'DELIVERED', 'RETURN_INITIATED', 'RETURNED_TO_ORIGIN', 'RETURNED', 'CANCELLED', 'DELAYED', 'LOST', 'DAMAGED');--> statement-breakpoint
CREATE TYPE "public"."redemption_status" AS ENUM('SUCCESS', 'FAILED', 'CANCELLED', 'ROLLED_BACK');--> statement-breakpoint
CREATE TYPE "public"."discount_type" AS ENUM('PERCENTAGE', 'FIXED_AMOUNT');--> statement-breakpoint
CREATE TYPE "public"."promotion_status" AS ENUM('DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'EXPIRED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."promotion_type" AS ENUM('COUPON', 'AUTOMATIC', 'FLASH_SALE', 'FREE_DELIVERY', 'BUY_X_GET_Y', 'LOYALTY', 'FIRST_ORDER', 'FESTIVAL');--> statement-breakpoint
CREATE TYPE "public"."referral_owner_type" AS ENUM('SELLER', 'BUYER', 'ADMIN', 'INFLUENCER', 'PARTNER');--> statement-breakpoint
CREATE TYPE "public"."referral_status" AS ENUM('ACTIVE', 'PAUSED', 'EXPIRED', 'DISABLED');--> statement-breakpoint
CREATE TYPE "public"."referral_event_status" AS ENUM('CLICKED', 'REGISTERED', 'VERIFIED', 'QUALIFIED', 'REJECTED', 'REWARDED', 'PURCHASE_COMPLETED', 'SUBSCRIPTION_PAID', 'FIRST_ORDER_COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."referral_event_owner_type" AS ENUM('SELLER', 'BUYER', 'ADMIN', 'INFLUENCER', 'PARTNER');--> statement-breakpoint
CREATE TYPE "public"."referral_event_user_type" AS ENUM('SELLER', 'BUYER');--> statement-breakpoint
CREATE TYPE "public"."reward_status" AS ENUM('ISSUED', 'REDEEMED', 'EXPIRED', 'REVOKED');--> statement-breakpoint
CREATE TYPE "public"."reward_type" AS ENUM('FREE_SUBSCRIPTION', 'COUPON', 'CASHBACK', 'WALLET_CREDIT', 'PROMOTIONAL_CREDIT', 'BADGE', 'FREE_DELIVERY', 'POINTS', 'GIFT');--> statement-breakpoint
CREATE TYPE "public"."reward_unit" AS ENUM('DAYS', 'INR', 'COUPON', 'POINTS');--> statement-breakpoint
CREATE TYPE "public"."conversation_participant_role" AS ENUM('MEMBER', 'OWNER', 'MODERATOR');--> statement-breakpoint
CREATE TYPE "public"."conversation_participant_type" AS ENUM('BUYER', 'SELLER', 'ADMIN', 'SUPPORT', 'DELIVERY_PARTNER', 'BOT');--> statement-breakpoint
CREATE TYPE "public"."conversation_type" AS ENUM('GENERAL', 'PRODUCT', 'ORDER', 'SUPPORT', 'GROUP', 'ANNOUNCEMENT');--> statement-breakpoint
CREATE TYPE "public"."message_attachment_type" AS ENUM('IMAGE', 'DOCUMENT', 'AUDIO', 'VIDEO', 'STICKER', 'GIF', 'CONTACT', 'LOCATION');--> statement-breakpoint
CREATE TYPE "public"."message_storage_provider" AS ENUM('R2', 'S3', 'GCS', 'LOCAL');--> statement-breakpoint
CREATE TYPE "public"."message_upload_status" AS ENUM('PENDING', 'UPLOADING', 'COMPLETED', 'FAILED', 'QUARANTINED');--> statement-breakpoint
CREATE TYPE "public"."message_receipt_status" AS ENUM('READ', 'DELIVERED', 'PLAYED');--> statement-breakpoint
CREATE TYPE "public"."message_sender_type" AS ENUM('BUYER', 'SELLER', 'ADMIN', 'SYSTEM', 'SUPPORT', 'BOT', 'DELIVERY_PARTNER');--> statement-breakpoint
CREATE TYPE "public"."message_type" AS ENUM('TEXT', 'IMAGE', 'PRODUCT', 'ORDER', 'SYSTEM', 'FILE', 'VOICE', 'VIDEO', 'LOCATION', 'CONTACT', 'STICKER');--> statement-breakpoint
CREATE TYPE "public"."quick_reply_category" AS ENUM('GENERAL', 'GREETING', 'PRODUCT', 'ORDER', 'DELIVERY', 'PAYMENT', 'RETURN', 'THANK_YOU', 'DISCOUNT', 'FOLLOW_UP', 'SUPPORT');--> statement-breakpoint
CREATE TYPE "public"."delivery_channel" AS ENUM('IN_APP', 'PUSH', 'EMAIL', 'SMS', 'WHATSAPP', 'VOICE_CALL');--> statement-breakpoint
CREATE TYPE "public"."delivery_status" AS ENUM('PENDING', 'SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'FAILED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('NEW_ORDER', 'NEW_MESSAGE', 'NEW_REVIEW', 'ORDER_STATUS', 'LOW_STOCK', 'PROMOTION', 'REFERRAL', 'SUBSCRIPTION', 'PAYMENT', 'SYSTEM', 'ANNOUNCEMENT', 'DELIVERY', 'RETURN', 'SECURITY_ALERT', 'ACCOUNT_VERIFICATION');--> statement-breakpoint
CREATE TYPE "public"."notification_priority" AS ENUM('LOW', 'NORMAL', 'HIGH', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "public"."recipient_type" AS ENUM('SELLER', 'BUYER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."reference_type" AS ENUM('ORDER', 'PRODUCT', 'MESSAGE', 'REVIEW', 'PROMOTION', 'REFERRAL', 'SUBSCRIPTION', 'PAYMENT');--> statement-breakpoint
CREATE TYPE "public"."user_type" AS ENUM('SELLER', 'BUYER', 'ADMIN', 'SUPPORT', 'DELIVERY_PARTNER');--> statement-breakpoint
CREATE TYPE "public"."push_platform" AS ENUM('ANDROID', 'IOS', 'WEB', 'DESKTOP');--> statement-breakpoint
CREATE TYPE "public"."push_provider" AS ENUM('FCM', 'APNS', 'WEB_PUSH');--> statement-breakpoint
CREATE TYPE "public"."push_token_status" AS ENUM('ACTIVE', 'INACTIVE', 'INVALID', 'REVOKED');--> statement-breakpoint
CREATE TYPE "public"."push_user_type" AS ENUM('SELLER', 'BUYER', 'ADMIN', 'SUPPORT', 'DELIVERY_PARTNER');--> statement-breakpoint
CREATE TYPE "public"."order_address_type" AS ENUM('DELIVERY', 'BILLING');--> statement-breakpoint
CREATE TYPE "public"."order_note_author_type" AS ENUM('BUYER', 'SELLER', 'ADMIN', 'SYSTEM', 'DELIVERY_PARTNER');--> statement-breakpoint
CREATE TYPE "public"."order_note_type" AS ENUM('GENERAL', 'DELIVERY', 'PACKING', 'PAYMENT', 'RETURN', 'DISPUTE', 'SYSTEM_EVENT');--> statement-breakpoint
CREATE TYPE "public"."order_note_visibility" AS ENUM('PRIVATE', 'BUYER_VISIBLE', 'SELLER_VISIBLE', 'ADMIN_ONLY');--> statement-breakpoint
CREATE TYPE "public"."p_order_status" AS ENUM('PENDING', 'CONFIRMED', 'PACKED', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'RETURNED');--> statement-breakpoint
CREATE TYPE "public"."payment_event_actor_type" AS ENUM('BUYER', 'SELLER', 'ADMIN', 'SYSTEM', 'PAYMENT_GATEWAY');--> statement-breakpoint
CREATE TYPE "public"."payment_event_type" AS ENUM('INITIATED', 'UPI_DETAILS_SHARED', 'PAYMENT_SUBMITTED', 'PAYMENT_VERIFIED', 'CASH_RECEIVED', 'SELLER_CONFIRMED', 'FAILED', 'CANCELLED', 'EXPIRED', 'REFUNDED', 'CHARGEBACK', 'PARTIALLY_REFUNDED', 'PAYOUT_COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."payment_actor_type" AS ENUM('BUYER', 'SELLER', 'PLATFORM');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('UPI', 'CASH', 'CARD', 'NET_BANKING', 'WALLET', 'BNPL', 'EMI');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."payment_type" AS ENUM('ORDER', 'SUBSCRIPTION', 'REFUND', 'PAYOUT', 'ADJUSTMENT');--> statement-breakpoint
CREATE TYPE "public"."inventory_reference_type" AS ENUM('ORDER', 'RETURN', 'ADJUSTMENT', 'IMPORT', 'SYSTEM');--> statement-breakpoint
CREATE TYPE "public"."inventory_transaction_type" AS ENUM('INITIAL_STOCK', 'STOCK_ADDED', 'STOCK_REMOVED', 'ORDER_RESERVED', 'ORDER_COMPLETED', 'ORDER_CANCELLED', 'ORDER_RETURNED', 'MANUAL_ADJUSTMENT', 'DAMAGED', 'LOST', 'SYSTEM_CORRECTION');--> statement-breakpoint
CREATE TYPE "public"."product_media_status" AS ENUM('UPLOADING', 'PROCESSING', 'ACTIVE', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."product_media_type" AS ENUM('IMAGE', 'VIDEO', 'MODEL_3D', 'AR', 'SPIN_360');--> statement-breakpoint
CREATE TYPE "public"."variant_status" AS ENUM('DRAFT', 'ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('DRAFT', 'INCOMPLETE', 'PUBLISHED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."product_type" AS ENUM('PHYSICAL', 'DIGITAL', 'SERVICE');--> statement-breakpoint
CREATE TYPE "public"."product_visibility" AS ENUM('PUBLIC', 'HIDDEN', 'PRIVATE');--> statement-breakpoint
CREATE TYPE "public"."exchange_reason" AS ENUM('SIZE_CHANGE', 'COLOR_CHANGE', 'WRONG_ITEM', 'DEFECTIVE', 'DAMAGED', 'QUALITY_ISSUE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."exchange_status" AS ENUM('REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WAITING_FOR_RETURN', 'INVENTORY_RESERVED', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'WAITLISTED', 'BACKORDERED');--> statement-breakpoint
CREATE TYPE "public"."payment_gateway" AS ENUM('RAZORPAY', 'CASHFREE', 'STRIPE', 'MANUAL');--> statement-breakpoint
CREATE TYPE "public"."refund_method" AS ENUM('ORIGINAL_PAYMENT', 'BANK_TRANSFER', 'STORE_CREDIT', 'MANUAL', 'UPI', 'WALLET');--> statement-breakpoint
CREATE TYPE "public"."refund_status" AS ENUM('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED', 'PARTIALLY_REFUNDED', 'RETRYING');--> statement-breakpoint
CREATE TYPE "public"."return_event_performed_by" AS ENUM('BUYER', 'SELLER', 'ADMIN', 'SYSTEM');--> statement-breakpoint
CREATE TYPE "public"."return_event_type" AS ENUM('RETURN_REQUESTED', 'UNDER_REVIEW', 'RETURN_APPROVED', 'RETURN_REJECTED', 'PICKUP_REQUESTED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'RETURN_RECEIVED', 'INSPECTION_STARTED', 'INSPECTION_COMPLETED', 'REFUND_APPROVED', 'REFUND_COMPLETED', 'EXCHANGE_APPROVED', 'EXCHANGE_SHIPPED', 'RETURN_COMPLETED', 'RETURN_CANCELLED', 'MANUAL_OVERRIDE', 'DISPUTE_OPENED', 'DISPUTE_RESOLVED');--> statement-breakpoint
CREATE TYPE "public"."return_event_status" AS ENUM('REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PICKUP_SCHEDULED', 'IN_TRANSIT', 'RECEIVED', 'INSPECTING', 'APPROVED_FOR_REFUND', 'REFUND_COMPLETED', 'EXCHANGE_IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'PARTIALLY_APPROVED', 'WAITING_FOR_CUSTOMER');--> statement-breakpoint
CREATE TYPE "public"."inspection_status" AS ENUM('PENDING', 'RECEIVED', 'PASSED', 'FAILED', 'PARTIALLY_APPROVED', 'REJECTED', 'DAMAGED_IN_TRANSIT', 'MISSING_ACCESSORIES');--> statement-breakpoint
CREATE TYPE "public"."return_reason" AS ENUM('DEFECTIVE', 'DAMAGED', 'WRONG_ITEM', 'SIZE_ISSUE', 'QUALITY_ISSUE', 'NOT_AS_DESCRIBED', 'MISSING_PARTS', 'CHANGED_MIND', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."return_status" AS ENUM('REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PICKUP_SCHEDULED', 'IN_TRANSIT', 'RECEIVED', 'INSPECTING', 'APPROVED_FOR_REFUND', 'REFUND_COMPLETED', 'EXCHANGE_IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'PARTIALLY_APPROVED', 'WAITING_FOR_CUSTOMER');--> statement-breakpoint
CREATE TYPE "public"."return_type" AS ENUM('REFUND', 'EXCHANGE', 'REPLACEMENT');--> statement-breakpoint
CREATE TYPE "public"."review_media_status" AS ENUM('ACTIVE', 'PENDING_MODERATION', 'HIDDEN', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."review_media_type" AS ENUM('IMAGE', 'VIDEO');--> statement-breakpoint
CREATE TYPE "public"."review_storage_provider" AS ENUM('R2', 'S3', 'GCS', 'LOCAL');--> statement-breakpoint
CREATE TYPE "public"."review_reply_status" AS ENUM('PUBLISHED', 'HIDDEN', 'UNDER_REVIEW', 'REMOVED');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('PUBLISHED', 'PENDING_MODERATION', 'HIDDEN', 'REPORTED', 'REMOVED');--> statement-breakpoint
CREATE TYPE "public"."address_type" AS ENUM('PICKUP', 'WAREHOUSE', 'RETURN', 'BILLING', 'REGISTERED_OFFICE', 'CORPORATE_OFFICE', 'SHOWROOM', 'FULFILLMENT_CENTER', 'DROPSHIP_LOCATION');--> statement-breakpoint
CREATE TYPE "public"."account_type" AS ENUM('SAVINGS', 'CURRENT', 'NRE', 'NRO', 'BUSINESS');--> statement-breakpoint
CREATE TYPE "public"."bank_verification_method" AS ENUM('MANUAL', 'PENNY_DROP', 'BANK_API', 'THIRD_PARTY');--> statement-breakpoint
CREATE TYPE "public"."bank_verification_status" AS ENUM('PENDING', 'IN_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."document_status" AS ENUM('UPLOADED', 'PENDING_REVIEW', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('GST', 'PAN', 'AADHAAR', 'MSME', 'FSSAI', 'IEC', 'TRADEMARK', 'BUSINESS_REGISTRATION', 'SHOP_LICENSE', 'DRUG_LICENSE', 'EXPORT_LICENSE', 'ISO_CERTIFICATE', 'CANCELLED_CHEQUE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."verification_method" AS ENUM('MANUAL', 'OCR', 'API', 'THIRD_PARTY_KYC');--> statement-breakpoint
CREATE TYPE "public"."onboarding_step" AS ENUM('EMAIL_VERIFICATION', 'PHONE_VERIFICATION', 'PROFILE', 'BUSINESS_DETAILS', 'STORE', 'ADDRESS', 'DOCUMENTS', 'BANK_ACCOUNT', 'SUBSCRIPTION', 'STORE_REVIEW', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."payout_method_type" AS ENUM('BANK_TRANSFER', 'UPI', 'RAZORPAYX', 'STRIPE_CONNECT', 'WISE', 'PAYPAL', 'PAYONEER', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."payout_verification_status" AS ENUM('PENDING', 'VERIFIED', 'REJECTED', 'DISABLED');--> statement-breakpoint
CREATE TYPE "public"."business_type" AS ENUM('INDIVIDUAL', 'PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PRIVATE_LIMITED', 'PUBLIC_LIMITED', 'TRUST', 'NGO', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."theme" AS ENUM('LIGHT', 'DARK', 'SYSTEM', 'HIGH_CONTRAST');--> statement-breakpoint
CREATE TYPE "public"."store_status" AS ENUM('DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'SUSPENDED', 'CLOSED', 'VACATION_MODE', 'MAINTENANCE', 'UNDER_INVESTIGATION');--> statement-breakpoint
CREATE TYPE "public"."store_visibility" AS ENUM('PRIVATE', 'PUBLIC', 'UNLISTED', 'INVITE_ONLY', 'MEMBERS_ONLY');--> statement-breakpoint
CREATE TYPE "public"."seller_verification_status" AS ENUM('NOT_SUBMITTED', 'PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."billing_type_snapshot" AS ENUM('TRIAL', 'MONTHLY', 'YEARLY', 'QUARTERLY', 'HALF_YEARLY');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('TRIAL', 'ACTIVE', 'GRACE_PERIOD', 'EXPIRED', 'CANCELLED', 'PENDING_PAYMENT', 'SUSPENDED');--> statement-breakpoint
CREATE TYPE "public"."subscription_event_type" AS ENUM('TRIAL_STARTED', 'TRIAL_ENDED', 'SUBSCRIPTION_ACTIVATED', 'SUBSCRIPTION_RENEWED', 'PLAN_UPGRADED', 'PLAN_DOWNGRADED', 'PAYMENT_RECEIVED', 'PAYMENT_FAILED', 'GRACE_PERIOD_STARTED', 'GRACE_PERIOD_ENDED', 'SUBSCRIPTION_EXPIRED', 'SUBSCRIPTION_CANCELLED', 'AUTO_RENEW_ENABLED', 'AUTO_RENEW_DISABLED', 'COUPON_APPLIED', 'REFUND_PROCESSED', 'MANUAL_EXTENSION');--> statement-breakpoint
CREATE TYPE "public"."subscription_event_status" AS ENUM('TRIAL', 'ACTIVE', 'GRACE_PERIOD', 'EXPIRED', 'CANCELLED', 'PENDING_PAYMENT', 'SUSPENDED');--> statement-breakpoint
CREATE TYPE "public"."subscription_event_triggered_by" AS ENUM('SELLER', 'ADMIN', 'SYSTEM');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('DRAFT', 'ISSUED', 'PAID', 'CANCELLED', 'VOID');--> statement-breakpoint
CREATE TYPE "public"."payment_methode" AS ENUM('UPI', 'CARD', 'NET_BANKING', 'WALLET', 'BANK_TRANSFER', 'EMI', 'PAY_LATER');--> statement-breakpoint
CREATE TYPE "public"."payments_status" AS ENUM('PENDING', 'AUTHORIZED', 'SUCCESS', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."feature_type" AS ENUM('BOOLEAN', 'INTEGER', 'DECIMAL', 'STRING', 'JSON');--> statement-breakpoint
CREATE TYPE "public"."billing_type" AS ENUM('TRIAL', 'MONTHLY', 'YEARLY', 'QUARTERLY', 'HALF_YEARLY');--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_type" "actor_type" DEFAULT 'SELLER' NOT NULL,
	"actor_id" uuid NOT NULL,
	"activity_type" "activity_type" NOT NULL,
	"title" varchar(150) NOT NULL,
	"description" text,
	"reference_type" "activity_reference_type",
	"reference_id" uuid,
	"metadata" jsonb,
	"visibility" "activity_visibility" DEFAULT 'PRIVATE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_type" "audit_actor_type" NOT NULL,
	"actor_id" uuid,
	"action" "audit_action" NOT NULL,
	"entity_type" "audit_entity_type" NOT NULL,
	"entity_id" uuid NOT NULL,
	"old_values" jsonb,
	"new_values" jsonb,
	"change_reason" varchar(255),
	"session_id" uuid,
	"device_id" uuid,
	"ip_hash" varchar(64),
	"user_agent" text,
	"request_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"name" varchar(120) NOT NULL,
	"slug" varchar(150) NOT NULL,
	"description" text,
	"icon_url" text,
	"banner_url" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"level" smallint DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category_attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"input_type" "attribute_input_type" NOT NULL,
	"is_required" boolean DEFAULT false NOT NULL,
	"is_filterable" boolean DEFAULT true NOT NULL,
	"is_variant_attribute" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"helper_text" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category_attribute_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attribute_id" uuid NOT NULL,
	"label" varchar(100) NOT NULL,
	"value" varchar(100) NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"color_hex" varchar(7),
	"metadata" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pickup_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shipment_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"shipping_partner_id" uuid NOT NULL,
	"pickup_reference" varchar(100) NOT NULL,
	"partner_pickup_id" varchar(255),
	"status" "pickup_status" DEFAULT 'REQUESTED' NOT NULL,
	"pickup_address_id" uuid NOT NULL,
	"requested_date" timestamp NOT NULL,
	"pickup_window_start" timestamp with time zone,
	"pickup_window_end" timestamp with time zone,
	"scheduled_at" timestamp with time zone,
	"picked_up_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"cancellation_reason" text,
	"attempt_count" smallint DEFAULT 0 NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipping_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"method_code" varchar(50) NOT NULL,
	"method_name" varchar(100) NOT NULL,
	"description" text,
	"estimated_min_days" smallint DEFAULT 1 NOT NULL,
	"estimated_max_days" smallint DEFAULT 3 NOT NULL,
	"max_weight_kg" numeric(8, 2),
	"supports_cod" boolean DEFAULT false NOT NULL,
	"supports_pickup" boolean DEFAULT true NOT NULL,
	"supports_return" boolean DEFAULT true NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" smallint DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipment_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"buyer_id" uuid NOT NULL,
	"shipping_partner_id" uuid NOT NULL,
	"shipping_method_id" uuid NOT NULL,
	"shipment_number" varchar(100) NOT NULL,
	"awb_number" varchar(150),
	"tracking_number" varchar(150),
	"status" "shipment_status" DEFAULT 'PENDING' NOT NULL,
	"pickup_scheduled_at" timestamp with time zone,
	"picked_up_at" timestamp with time zone,
	"shipped_at" timestamp with time zone,
	"estimated_delivery_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"delivery_attempts" smallint DEFAULT 0 NOT NULL,
	"shipping_cost" numeric(10, 2) DEFAULT '0' NOT NULL,
	"cod_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipping_partners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_code" varchar(50) NOT NULL,
	"partner_name" varchar(150) NOT NULL,
	"website_url" varchar(255),
	"tracking_url_template" varchar(500),
	"contact_email" varchar(255),
	"contact_phone" varchar(30),
	"supports_cod" boolean DEFAULT false NOT NULL,
	"supports_pickup" boolean DEFAULT true NOT NULL,
	"supports_return" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" smallint DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipment_tracking_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shipment_id" uuid NOT NULL,
	"tracking_status" "tracking_status" NOT NULL,
	"event_code" varchar(100),
	"event_description" text NOT NULL,
	"location_name" varchar(255),
	"city" varchar(150),
	"state" varchar(150),
	"country" varchar(100),
	"postal_code" varchar(20),
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"raw_payload" jsonb,
	"occurred_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupon_redemptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"promotion_id" uuid NOT NULL,
	"buyer_id" uuid NOT NULL,
	"order_id" uuid,
	"status" "redemption_status" DEFAULT 'SUCCESS' NOT NULL,
	"discount_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"order_subtotal" numeric(10, 2) NOT NULL,
	"failure_reason" varchar(255),
	"buyer_ip_hash" varchar(64),
	"redeemed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promotion_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"promotion_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"priority" smallint DEFAULT 100 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promotions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"name" varchar(150) NOT NULL,
	"description" text,
	"promotion_type" "promotion_type" NOT NULL,
	"coupon_code" varchar(50),
	"discount_type" "discount_type" NOT NULL,
	"discount_value" numeric(10, 2) NOT NULL,
	"minimum_order_amount" numeric(10, 2),
	"maximum_discount_amount" numeric(10, 2),
	"usage_limit" integer,
	"usage_per_buyer" integer DEFAULT 1 NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"status" "promotion_status" DEFAULT 'DRAFT' NOT NULL,
	"total_redemptions" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "referral_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_type" "referral_owner_type" DEFAULT 'SELLER' NOT NULL,
	"owner_id" uuid NOT NULL,
	"campaign_name" varchar(100) DEFAULT 'DEFAULT' NOT NULL,
	"referral_code" varchar(30) NOT NULL,
	"description" text,
	"max_usage_limit" integer,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"starts_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"status" "referral_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referral_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referral_code_id" uuid NOT NULL,
	"referrer_id" uuid NOT NULL,
	"referrer_type" "referral_event_owner_type" DEFAULT 'SELLER' NOT NULL,
	"referred_user_id" uuid NOT NULL,
	"referred_user_type" "referral_event_user_type" DEFAULT 'SELLER' NOT NULL,
	"campaign_name" varchar(100) NOT NULL,
	"status" "referral_event_status" DEFAULT 'CLICKED' NOT NULL,
	"qualified_at" timestamp with time zone,
	"reward_issued" boolean DEFAULT false NOT NULL,
	"ip_hash" varchar(64),
	"device_fingerprint_hash" varchar(128),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referral_rewards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referral_event_id" uuid NOT NULL,
	"recipient_type" varchar(50) DEFAULT 'SELLER' NOT NULL,
	"recipient_id" uuid NOT NULL,
	"reward_type" "reward_type" NOT NULL,
	"reward_value" numeric(10, 2),
	"reward_unit" "reward_unit" NOT NULL,
	"promotion_id" uuid,
	"expires_at" timestamp with time zone,
	"redeemed_at" timestamp with time zone,
	"status" "reward_status" DEFAULT 'ISSUED' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversation_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"participant_type" "conversation_participant_type" NOT NULL,
	"participant_id" uuid NOT NULL,
	"role" "conversation_participant_role" DEFAULT 'MEMBER' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_read_message_id" uuid,
	"last_read_at" timestamp with time zone,
	"unread_count" integer DEFAULT 0 NOT NULL,
	"is_muted" boolean DEFAULT false NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"left_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_type" "conversation_type" DEFAULT 'GENERAL' NOT NULL,
	"buyer_id" uuid,
	"seller_id" uuid,
	"order_id" uuid,
	"product_id" uuid,
	"last_message_id" uuid,
	"last_message_at" timestamp with time zone,
	"is_archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_id" uuid NOT NULL,
	"attachment_type" "message_attachment_type" NOT NULL,
	"storage_provider" "message_storage_provider" NOT NULL,
	"storage_key" varchar(500) NOT NULL,
	"original_filename" varchar(255),
	"mime_type" varchar(100) NOT NULL,
	"file_size_bytes" bigint NOT NULL,
	"width" integer,
	"height" integer,
	"duration_seconds" integer,
	"thumbnail_storage_key" varchar(500),
	"checksum_sha256" varchar(64),
	"upload_status" "message_upload_status" DEFAULT 'COMPLETED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message_read_receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_id" uuid NOT NULL,
	"conversation_participant_id" uuid NOT NULL,
	"status" "message_receipt_status" DEFAULT 'READ' NOT NULL,
	"read_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"sender_type" "message_sender_type" NOT NULL,
	"sender_id" uuid,
	"message_type" "message_type" DEFAULT 'TEXT' NOT NULL,
	"content" text,
	"reply_to_message_id" uuid,
	"related_product_id" uuid,
	"related_order_id" uuid,
	"sequence_number" bigint NOT NULL,
	"is_edited" boolean DEFAULT false NOT NULL,
	"edited_at" timestamp with time zone,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quick_replies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid,
	"category" "quick_reply_category" DEFAULT 'GENERAL' NOT NULL,
	"title" varchar(100) NOT NULL,
	"message" text NOT NULL,
	"language_code" varchar(10) DEFAULT 'en' NOT NULL,
	"is_system_template" boolean DEFAULT false NOT NULL,
	"is_favorite" boolean DEFAULT false NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_deliveries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"notification_id" uuid NOT NULL,
	"channel" "delivery_channel" NOT NULL,
	"provider" varchar(100),
	"provider_message_id" varchar(255),
	"status" "delivery_status" DEFAULT 'PENDING' NOT NULL,
	"attempt_count" integer DEFAULT 1 NOT NULL,
	"sent_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"opened_at" timestamp with time zone,
	"clicked_at" timestamp with time zone,
	"failure_reason" text,
	"last_retry_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipient_type" "recipient_type" DEFAULT 'SELLER' NOT NULL,
	"recipient_id" uuid NOT NULL,
	"notification_type" "notification_type" NOT NULL,
	"title" varchar(150) NOT NULL,
	"message" text NOT NULL,
	"reference_type" "reference_type",
	"reference_id" uuid,
	"priority" "notification_priority" DEFAULT 'NORMAL' NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp with time zone,
	"is_archived" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_type" "user_type" DEFAULT 'SELLER' NOT NULL,
	"user_id" uuid NOT NULL,
	"language_code" varchar(10) DEFAULT 'en' NOT NULL,
	"timezone" varchar(100) DEFAULT 'Asia/Kolkata' NOT NULL,
	"push_enabled" boolean DEFAULT true NOT NULL,
	"email_enabled" boolean DEFAULT true NOT NULL,
	"sms_enabled" boolean DEFAULT false NOT NULL,
	"marketing_enabled" boolean DEFAULT true NOT NULL,
	"system_enabled" boolean DEFAULT true NOT NULL,
	"order_enabled" boolean DEFAULT true NOT NULL,
	"message_enabled" boolean DEFAULT true NOT NULL,
	"review_enabled" boolean DEFAULT true NOT NULL,
	"promotion_enabled" boolean DEFAULT true NOT NULL,
	"subscription_enabled" boolean DEFAULT true NOT NULL,
	"quiet_hours_enabled" boolean DEFAULT false NOT NULL,
	"quiet_hours_start" time,
	"quiet_hours_end" time,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "push_device_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_type" "push_user_type" DEFAULT 'SELLER' NOT NULL,
	"user_id" uuid NOT NULL,
	"device_id" uuid NOT NULL,
	"platform" "push_platform" NOT NULL,
	"provider" "push_provider" DEFAULT 'FCM' NOT NULL,
	"push_token" text NOT NULL,
	"device_name" varchar(100),
	"app_version" varchar(30),
	"os_version" varchar(30),
	"language_code" varchar(10) DEFAULT 'en' NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_token_refresh_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" "push_token_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"address_type" "order_address_type" DEFAULT 'DELIVERY' NOT NULL,
	"recipient_name" varchar(150) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"address_line_1" varchar(255) NOT NULL,
	"address_line_2" varchar(255),
	"landmark" varchar(255),
	"city" varchar(100) NOT NULL,
	"district" varchar(100),
	"state" varchar(100) NOT NULL,
	"postal_code" varchar(20) NOT NULL,
	"country" varchar(100) DEFAULT 'India' NOT NULL,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"delivery_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ordered_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"product_name" varchar(200) NOT NULL,
	"variant_summary" varchar(255) NOT NULL,
	"sku" varchar(100),
	"unit_price" numeric(12, 2) NOT NULL,
	"discount_amount" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"quantity" integer NOT NULL,
	"line_total" numeric(12, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"author_type" "order_note_author_type" NOT NULL,
	"author_id" uuid,
	"visibility" "order_note_visibility" DEFAULT 'PRIVATE' NOT NULL,
	"note_type" "order_note_type" DEFAULT 'GENERAL' NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" varchar(30) NOT NULL,
	"buyer_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"status" "p_order_status" DEFAULT 'PENDING' NOT NULL,
	"currency" char(3) DEFAULT 'INR' NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL,
	"discount_amount" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"delivery_charge" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"notes" text,
	"placed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"confirmed_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" uuid NOT NULL,
	"event_type" "payment_event_type" NOT NULL,
	"previous_status" "payment_status",
	"current_status" "payment_status" NOT NULL,
	"performed_by_type" "payment_event_actor_type" NOT NULL,
	"performed_by_id" uuid,
	"gateway_payload" jsonb,
	"remarks" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_reference" varchar(100) NOT NULL,
	"payment_type" "payment_type" NOT NULL,
	"order_id" uuid,
	"subscription_id" uuid,
	"payer_type" "payment_actor_type" NOT NULL,
	"payer_id" uuid NOT NULL,
	"payee_type" "payment_actor_type" NOT NULL,
	"payee_id" uuid,
	"payment_method" "payment_method" NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" char(3) DEFAULT 'INR' NOT NULL,
	"status" "payment_status" DEFAULT 'PENDING' NOT NULL,
	"gateway_reference" varchar(255),
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inventory_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"transaction_type" "inventory_transaction_type" NOT NULL,
	"quantity_change" integer NOT NULL,
	"reserved_change" integer DEFAULT 0 NOT NULL,
	"reference_type" "inventory_reference_type",
	"reference_id" uuid,
	"notes" text,
	"performed_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"reserved_quantity" integer DEFAULT 0 NOT NULL,
	"low_stock_threshold" integer DEFAULT 5 NOT NULL,
	"allow_backorder" boolean DEFAULT false NOT NULL,
	"last_adjusted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid,
	"storage_key" varchar(500) NOT NULL,
	"cdn_url" text NOT NULL,
	"media_type" "product_media_type" DEFAULT 'IMAGE' NOT NULL,
	"alt_text" varchar(255),
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"status" "product_media_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"sku" varchar(100) NOT NULL,
	"barcode" varchar(100),
	"price" numeric(12, 2) NOT NULL,
	"compare_at_price" numeric(12, 2),
	"cost_price" numeric(12, 2),
	"weight_grams" integer,
	"status" "variant_status" DEFAULT 'ACTIVE' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"brand_id" uuid,
	"name" varchar(200) NOT NULL,
	"slug" varchar(220) NOT NULL,
	"short_description" varchar(500),
	"description" text,
	"product_type" "product_type" DEFAULT 'PHYSICAL' NOT NULL,
	"status" "product_status" DEFAULT 'DRAFT' NOT NULL,
	"visibility" "product_visibility" DEFAULT 'PUBLIC' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "variant_attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"attribute_id" uuid NOT NULL,
	"option_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exchange_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"return_request_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"buyer_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"original_order_item_id" uuid NOT NULL,
	"replacement_product_id" uuid NOT NULL,
	"replacement_variant_id" uuid,
	"replacement_quantity" integer DEFAULT 1 NOT NULL,
	"replacement_shipment_id" uuid,
	"status" "exchange_status" DEFAULT 'REQUESTED' NOT NULL,
	"exchange_reason" "exchange_reason" NOT NULL,
	"inventory_reserved" boolean DEFAULT false NOT NULL,
	"inventory_reserved_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refunds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"return_request_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"buyer_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"payment_id" uuid,
	"refund_number" varchar(100) NOT NULL,
	"gateway_refund_id" varchar(255),
	"payment_gateway" "payment_gateway" NOT NULL,
	"refund_method" "refund_method" DEFAULT 'ORIGINAL_PAYMENT' NOT NULL,
	"refund_amount" numeric(10, 2) NOT NULL,
	"currency_code" varchar(3) DEFAULT 'INR' NOT NULL,
	"status" "refund_status" DEFAULT 'PENDING' NOT NULL,
	"failure_reason" text,
	"processed_at" timestamp with time zone,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "return_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"return_request_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"buyer_id" uuid NOT NULL,
	"event_type" "return_event_type" NOT NULL,
	"previous_status" "return_event_status",
	"new_status" "return_event_status",
	"performed_by" "return_event_performed_by" DEFAULT 'SYSTEM' NOT NULL,
	"performed_by_id" uuid,
	"notes" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "return_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"return_request_id" uuid NOT NULL,
	"order_item_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid,
	"ordered_quantity" integer NOT NULL,
	"requested_quantity" integer NOT NULL,
	"approved_quantity" integer DEFAULT 0 NOT NULL,
	"received_quantity" integer DEFAULT 0 NOT NULL,
	"unit_price_snapshot" numeric(10, 2) NOT NULL,
	"refund_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"return_reason" varchar(50) NOT NULL,
	"inspection_status" "inspection_status" DEFAULT 'PENDING' NOT NULL,
	"inspection_notes" text,
	"restockable" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "return_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"buyer_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"return_number" varchar(100) NOT NULL,
	"status" "return_status" DEFAULT 'REQUESTED' NOT NULL,
	"return_reason" "return_reason" NOT NULL,
	"return_type" "return_type" DEFAULT 'REFUND' NOT NULL,
	"buyer_comment" text,
	"seller_comment" text,
	"pickup_required" boolean DEFAULT true NOT NULL,
	"pickup_request_id" uuid,
	"approved_at" timestamp with time zone,
	"rejected_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"review_id" uuid NOT NULL,
	"media_type" "review_media_type" DEFAULT 'IMAGE' NOT NULL,
	"storage_provider" "review_storage_provider" DEFAULT 'R2' NOT NULL,
	"storage_key" varchar(500) NOT NULL,
	"thumbnail_storage_key" varchar(500),
	"original_filename" varchar(255),
	"mime_type" varchar(100) NOT NULL,
	"file_size_bytes" bigint NOT NULL,
	"width" integer,
	"height" integer,
	"duration_seconds" integer,
	"checksum_sha256" varchar(64),
	"display_order" smallint DEFAULT 1 NOT NULL,
	"status" "review_media_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_replies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"review_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"reply_text" text NOT NULL,
	"status" "review_reply_status" DEFAULT 'PUBLISHED' NOT NULL,
	"is_edited" boolean DEFAULT false NOT NULL,
	"edited_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_item_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid,
	"buyer_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"rating" smallint NOT NULL,
	"title" varchar(150),
	"review_text" text,
	"is_verified_purchase" boolean DEFAULT true NOT NULL,
	"status" "review_status" DEFAULT 'PUBLISHED' NOT NULL,
	"helpful_count" integer DEFAULT 0 NOT NULL,
	"seller_reply_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid,
	"name" varchar(150) NOT NULL,
	"slug" varchar(180) NOT NULL,
	"description" text,
	"logo_url" text,
	"website_url" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seller_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"label" varchar(100) NOT NULL,
	"address_type" "address_type" NOT NULL,
	"contact_person" varchar(150),
	"contact_phone" varchar(20),
	"company_name" varchar(200),
	"address_line_1" varchar(255) NOT NULL,
	"address_line_2" varchar(255),
	"landmark" varchar(150),
	"city" varchar(120) NOT NULL,
	"district" varchar(120),
	"state" varchar(120) NOT NULL,
	"postal_code" varchar(20) NOT NULL,
	"country_code" varchar(2) DEFAULT 'IN' NOT NULL,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"is_default" boolean DEFAULT false NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verified_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seller_bank_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"account_holder_name" varchar(200) NOT NULL,
	"bank_name" varchar(200) NOT NULL,
	"account_number" text NOT NULL,
	"account_number_last4" varchar(4) NOT NULL,
	"ifsc_code" varchar(20) NOT NULL,
	"branch_name" varchar(200),
	"account_type" "account_type" DEFAULT 'SAVINGS' NOT NULL,
	"verification_status" "bank_verification_status" DEFAULT 'PENDING' NOT NULL,
	"verification_method" "bank_verification_method" DEFAULT 'MANUAL' NOT NULL,
	"verified_at" timestamp with time zone,
	"verified_by" uuid,
	"is_primary" boolean DEFAULT false NOT NULL,
	"upi_id" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "seller_bank_accounts_upi_id_unique" UNIQUE("upi_id"),
	CONSTRAINT "seller_bank_accounts_upi_id_check" CHECK ("seller_bank_accounts"."upi_id" IS NULL OR "seller_bank_accounts"."upi_id" ~* '^[a-zA-Z0-9.\-_]+@[a-zA-Z0-9.\-_]+$')
);
--> statement-breakpoint
CREATE TABLE "seller_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"document_type" "document_type" NOT NULL,
	"document_name" varchar(255),
	"document_number" varchar(100),
	"file_url" text NOT NULL,
	"mime_type" varchar(100),
	"file_size_bytes" bigint,
	"version" integer DEFAULT 1 NOT NULL,
	"status" "document_status" DEFAULT 'UPLOADED' NOT NULL,
	"verification_method" "verification_method" DEFAULT 'MANUAL' NOT NULL,
	"review_notes" text,
	"rejection_reason" text,
	"metadata" jsonb,
	"verified_by" uuid,
	"verified_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"is_primary" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "seller_onboarding_progress" (
	"seller_id" uuid PRIMARY KEY NOT NULL,
	"current_step" "onboarding_step" DEFAULT 'PROFILE' NOT NULL,
	"completed_steps" jsonb DEFAULT '[]' NOT NULL,
	"completion_percentage" smallint DEFAULT 0 NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone,
	"last_step_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seller_payout_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"method_type" "payout_method_type" NOT NULL,
	"bank_account_id" uuid,
	"provider_name" varchar(100),
	"provider_account_id" varchar(255),
	"upi_id" varchar(255),
	"verification_status" "payout_verification_status" DEFAULT 'PENDING' NOT NULL,
	"verified_at" timestamp with time zone,
	"is_default" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "seller_profiles" (
	"seller_id" uuid PRIMARY KEY NOT NULL,
	"display_name" varchar(120) NOT NULL,
	"phone_number" varchar(20),
	"phone_verified" boolean DEFAULT false NOT NULL,
	"profile_image_url" text,
	"business_name" varchar(200),
	"business_type" "business_type",
	"support_email" varchar(255),
	"support_phone" varchar(20),
	"website_url" text,
	"bio" text,
	"date_of_birth" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seller_settings" (
	"seller_id" uuid PRIMARY KEY NOT NULL,
	"language_code" varchar(10) DEFAULT 'en' NOT NULL,
	"currency_code" varchar(3) DEFAULT 'INR' NOT NULL,
	"timezone" varchar(100) DEFAULT 'Asia/Kolkata' NOT NULL,
	"email_notifications" boolean DEFAULT true NOT NULL,
	"sms_notifications" boolean DEFAULT true NOT NULL,
	"push_notifications" boolean DEFAULT true NOT NULL,
	"marketing_notifications" boolean DEFAULT false NOT NULL,
	"order_notifications" boolean DEFAULT true NOT NULL,
	"payout_notifications" boolean DEFAULT true NOT NULL,
	"low_inventory_notifications" boolean DEFAULT true NOT NULL,
	"theme" "theme" DEFAULT 'SYSTEM' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seller_store" (
	"seller_id" uuid PRIMARY KEY NOT NULL,
	"store_name" varchar(150) NOT NULL,
	"store_slug" varchar(150) NOT NULL,
	"logo_url" text,
	"banner_url" text,
	"short_description" varchar(255),
	"description" text,
	"support_email" varchar(255),
	"support_phone" varchar(20),
	"status" "store_status" DEFAULT 'DRAFT' NOT NULL,
	"visibility" "store_visibility" DEFAULT 'PRIVATE' NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verified_at" timestamp with time zone,
	"launched_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "seller_store_store_slug_unique" UNIQUE("store_slug")
);
--> statement-breakpoint
CREATE TABLE "seller_verification" (
	"seller_id" uuid PRIMARY KEY NOT NULL,
	"status" "seller_verification_status" DEFAULT 'NOT_SUBMITTED' NOT NULL,
	"submitted_at" timestamp with time zone,
	"review_started_at" timestamp with time zone,
	"verified_at" timestamp with time zone,
	"reviewed_by" uuid,
	"rejection_reason" text,
	"review_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seller_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"plan_name_snapshot" varchar(100) NOT NULL,
	"plan_price_snapshot" numeric(10, 2) NOT NULL,
	"billing_type_snapshot" "billing_type_snapshot" NOT NULL,
	"status" "subscription_status" DEFAULT 'TRIAL' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"trial_ends_at" timestamp with time zone,
	"current_period_start" timestamp with time zone NOT NULL,
	"current_period_end" timestamp with time zone NOT NULL,
	"grace_period_ends_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"auto_renew" boolean DEFAULT false NOT NULL,
	"is_trial_used" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"event_type" "subscription_event_type" NOT NULL,
	"previous_status" "subscription_event_status",
	"new_status" "subscription_event_status",
	"previous_plan_id" uuid,
	"new_plan_id" uuid,
	"payment_id" uuid,
	"invoice_id" uuid,
	"triggered_by" "subscription_event_triggered_by" DEFAULT 'SYSTEM' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_number" varchar(100) NOT NULL,
	"seller_id" uuid NOT NULL,
	"subscription_id" uuid NOT NULL,
	"payment_id" uuid,
	"plan_name_snapshot" varchar(100) NOT NULL,
	"billing_period_start" timestamp with time zone NOT NULL,
	"billing_period_end" timestamp with time zone NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"discount_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"tax_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"currency_code" varchar(3) DEFAULT 'INR' NOT NULL,
	"status" "invoice_status" DEFAULT 'ISSUED' NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"due_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"pdf_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"invoice_number" varchar(100),
	"payment_gateway" "payment_gateway" NOT NULL,
	"gateway_order_id" varchar(255),
	"gateway_payment_id" varchar(255),
	"gateway_transaction_id" varchar(255),
	"amount" numeric(10, 2) NOT NULL,
	"currency_code" varchar(3) DEFAULT 'INR' NOT NULL,
	"tax_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"discount_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"net_amount" numeric(10, 2) NOT NULL,
	"payment_method" "payment_methode" NOT NULL,
	"status" "payments_status" DEFAULT 'PENDING' NOT NULL,
	"paid_at" timestamp with time zone,
	"failure_reason" text,
	"gateway_response" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_plan_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"feature_key" varchar(100) NOT NULL,
	"feature_name" varchar(150) NOT NULL,
	"feature_type" "feature_type" NOT NULL,
	"feature_value" varchar(255) NOT NULL,
	"description" text,
	"display_order" smallint DEFAULT 1 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_code" varchar(50) NOT NULL,
	"plan_name" varchar(100) NOT NULL,
	"description" text,
	"billing_type" "billing_type" DEFAULT 'MONTHLY' NOT NULL,
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"currency_code" varchar(3) DEFAULT 'INR' NOT NULL,
	"trial_days" smallint DEFAULT 40 NOT NULL,
	"display_order" smallint DEFAULT 1 NOT NULL,
	"is_popular" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_attributes" ADD CONSTRAINT "category_attributes_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_attribute_options" ADD CONSTRAINT "category_attribute_options_attribute_id_category_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."category_attributes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pickup_requests" ADD CONSTRAINT "pickup_requests_shipment_id_shipment_orders_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipment_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pickup_requests" ADD CONSTRAINT "pickup_requests_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pickup_requests" ADD CONSTRAINT "pickup_requests_shipping_partner_id_shipping_partners_id_fk" FOREIGN KEY ("shipping_partner_id") REFERENCES "public"."shipping_partners"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pickup_requests" ADD CONSTRAINT "pickup_requests_pickup_address_id_order_addresses_id_fk" FOREIGN KEY ("pickup_address_id") REFERENCES "public"."order_addresses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping_methods" ADD CONSTRAINT "shipping_methods_partner_id_shipping_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."shipping_partners"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment_orders" ADD CONSTRAINT "shipment_orders_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment_orders" ADD CONSTRAINT "shipment_orders_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment_orders" ADD CONSTRAINT "shipment_orders_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment_orders" ADD CONSTRAINT "shipment_orders_shipping_partner_id_shipping_partners_id_fk" FOREIGN KEY ("shipping_partner_id") REFERENCES "public"."shipping_partners"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment_orders" ADD CONSTRAINT "shipment_orders_shipping_method_id_shipping_methods_id_fk" FOREIGN KEY ("shipping_method_id") REFERENCES "public"."shipping_methods"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment_tracking_events" ADD CONSTRAINT "shipment_tracking_events_shipment_id_shipment_orders_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipment_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_promotion_id_promotions_id_fk" FOREIGN KEY ("promotion_id") REFERENCES "public"."promotions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotion_products" ADD CONSTRAINT "promotion_products_promotion_id_promotions_id_fk" FOREIGN KEY ("promotion_id") REFERENCES "public"."promotions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotion_products" ADD CONSTRAINT "promotion_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_events" ADD CONSTRAINT "referral_events_referral_code_id_referral_codes_id_fk" FOREIGN KEY ("referral_code_id") REFERENCES "public"."referral_codes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_events" ADD CONSTRAINT "referral_events_referred_user_id_users_id_fk" FOREIGN KEY ("referred_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_rewards" ADD CONSTRAINT "referral_rewards_referral_event_id_referral_events_id_fk" FOREIGN KEY ("referral_event_id") REFERENCES "public"."referral_events"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_rewards" ADD CONSTRAINT "referral_rewards_promotion_id_promotions_id_fk" FOREIGN KEY ("promotion_id") REFERENCES "public"."promotions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_attachments" ADD CONSTRAINT "message_attachments_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_read_receipts" ADD CONSTRAINT "message_read_receipts_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_read_receipts" ADD CONSTRAINT "message_read_receipts_conversation_participant_id_conversation_participants_id_fk" FOREIGN KEY ("conversation_participant_id") REFERENCES "public"."conversation_participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_reply_to_message_id_messages_id_fk" FOREIGN KEY ("reply_to_message_id") REFERENCES "public"."messages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_related_product_id_products_id_fk" FOREIGN KEY ("related_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_related_order_id_product_orders_id_fk" FOREIGN KEY ("related_order_id") REFERENCES "public"."product_orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_deliveries" ADD CONSTRAINT "notification_deliveries_notification_id_notifications_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_device_tokens" ADD CONSTRAINT "push_device_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_addresses" ADD CONSTRAINT "order_addresses_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordered_items" ADD CONSTRAINT "ordered_items_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordered_items" ADD CONSTRAINT "ordered_items_product_id_product_orders_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordered_items" ADD CONSTRAINT "ordered_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_notes" ADD CONSTRAINT "order_notes_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_events" ADD CONSTRAINT "payment_events_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_inventory_id_inventory_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_attributes" ADD CONSTRAINT "variant_attributes_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_attributes" ADD CONSTRAINT "variant_attributes_attribute_id_category_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."category_attributes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_attributes" ADD CONSTRAINT "variant_attributes_option_id_category_attribute_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."category_attribute_options"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_requests" ADD CONSTRAINT "exchange_requests_return_request_id_return_requests_id_fk" FOREIGN KEY ("return_request_id") REFERENCES "public"."return_requests"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_requests" ADD CONSTRAINT "exchange_requests_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_requests" ADD CONSTRAINT "exchange_requests_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_requests" ADD CONSTRAINT "exchange_requests_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_requests" ADD CONSTRAINT "exchange_requests_original_order_item_id_order_items_id_fk" FOREIGN KEY ("original_order_item_id") REFERENCES "public"."order_items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_requests" ADD CONSTRAINT "exchange_requests_replacement_product_id_products_id_fk" FOREIGN KEY ("replacement_product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_requests" ADD CONSTRAINT "exchange_requests_replacement_variant_id_product_variants_id_fk" FOREIGN KEY ("replacement_variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_requests" ADD CONSTRAINT "exchange_requests_replacement_shipment_id_shipment_orders_id_fk" FOREIGN KEY ("replacement_shipment_id") REFERENCES "public"."shipment_orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_return_request_id_return_requests_id_fk" FOREIGN KEY ("return_request_id") REFERENCES "public"."return_requests"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_payment_id_subscription_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."subscription_payments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_events" ADD CONSTRAINT "return_events_return_request_id_return_requests_id_fk" FOREIGN KEY ("return_request_id") REFERENCES "public"."return_requests"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_events" ADD CONSTRAINT "return_events_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_events" ADD CONSTRAINT "return_events_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_return_request_id_return_requests_id_fk" FOREIGN KEY ("return_request_id") REFERENCES "public"."return_requests"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_order_item_id_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_pickup_request_id_pickup_requests_id_fk" FOREIGN KEY ("pickup_request_id") REFERENCES "public"."pickup_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_images" ADD CONSTRAINT "review_images_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_replies" ADD CONSTRAINT "review_replies_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_item_id_ordered_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."ordered_items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_addresses" ADD CONSTRAINT "seller_addresses_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_bank_accounts" ADD CONSTRAINT "seller_bank_accounts_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_bank_accounts" ADD CONSTRAINT "seller_bank_accounts_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_documents" ADD CONSTRAINT "seller_documents_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_documents" ADD CONSTRAINT "seller_documents_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_onboarding_progress" ADD CONSTRAINT "seller_onboarding_progress_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_payout_methods" ADD CONSTRAINT "seller_payout_methods_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_payout_methods" ADD CONSTRAINT "seller_payout_methods_bank_account_id_seller_bank_accounts_id_fk" FOREIGN KEY ("bank_account_id") REFERENCES "public"."seller_bank_accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_profiles" ADD CONSTRAINT "seller_profiles_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_settings" ADD CONSTRAINT "seller_settings_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_store" ADD CONSTRAINT "seller_store_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_verification" ADD CONSTRAINT "seller_verification_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_verification" ADD CONSTRAINT "seller_verification_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_subscriptions" ADD CONSTRAINT "seller_subscriptions_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_subscriptions" ADD CONSTRAINT "seller_subscriptions_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_events" ADD CONSTRAINT "subscription_events_subscription_id_seller_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."seller_subscriptions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_events" ADD CONSTRAINT "subscription_events_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_events" ADD CONSTRAINT "subscription_events_previous_plan_id_subscription_plans_id_fk" FOREIGN KEY ("previous_plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_events" ADD CONSTRAINT "subscription_events_new_plan_id_subscription_plans_id_fk" FOREIGN KEY ("new_plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_events" ADD CONSTRAINT "subscription_events_payment_id_subscription_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."subscription_payments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_events" ADD CONSTRAINT "subscription_events_invoice_id_subscription_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."subscription_invoices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_invoices" ADD CONSTRAINT "subscription_invoices_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_invoices" ADD CONSTRAINT "subscription_invoices_subscription_id_seller_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."seller_subscriptions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_invoices" ADD CONSTRAINT "subscription_invoices_payment_id_subscription_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."subscription_payments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_subscription_id_seller_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."seller_subscriptions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_plan_features" ADD CONSTRAINT "subscription_plan_features_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "cat_attr_category_slug_idx" ON "category_attributes" USING btree ("category_id","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "cat_attr_options_val_idx" ON "category_attribute_options" USING btree ("attribute_id","value");--> statement-breakpoint
CREATE UNIQUE INDEX "promotion_product_unique_idx" ON "promotion_products" USING btree ("promotion_id","product_id");--> statement-breakpoint
CREATE INDEX "promotions_seller_idx" ON "promotions" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "promotions_status_idx" ON "promotions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "promotions_coupon_idx" ON "promotions" USING btree ("coupon_code");--> statement-breakpoint
CREATE INDEX "promotions_schedule_idx" ON "promotions" USING btree ("starts_at","ends_at");--> statement-breakpoint
CREATE UNIQUE INDEX "referral_code_unique_idx" ON "referral_codes" USING btree ("referral_code");--> statement-breakpoint
CREATE UNIQUE INDEX "referral_owner_campaign_idx" ON "referral_codes" USING btree ("owner_id","campaign_name");--> statement-breakpoint
CREATE UNIQUE INDEX "conv_participant_unique_idx" ON "conversation_participants" USING btree ("conversation_id","participant_id");--> statement-breakpoint
CREATE INDEX "conv_participant_lookup_idx" ON "conversation_participants" USING btree ("participant_id");--> statement-breakpoint
CREATE INDEX "conversations_buyer_inbox_idx" ON "conversations" USING btree ("buyer_id","last_message_at");--> statement-breakpoint
CREATE INDEX "conversations_seller_inbox_idx" ON "conversations" USING btree ("seller_id","last_message_at");--> statement-breakpoint
CREATE INDEX "conversations_order_idx" ON "conversations" USING btree ("order_id") WHERE "conversations"."order_id" is not null;--> statement-breakpoint
CREATE INDEX "msg_attachments_message_idx" ON "message_attachments" USING btree ("message_id");--> statement-breakpoint
CREATE UNIQUE INDEX "receipt_user_msg_uniq_idx" ON "message_read_receipts" USING btree ("message_id","conversation_participant_id");--> statement-breakpoint
CREATE INDEX "receipt_participant_lookup_idx" ON "message_read_receipts" USING btree ("conversation_participant_id");--> statement-breakpoint
CREATE INDEX "messages_stream_idx" ON "messages" USING btree ("conversation_id","sequence_number");--> statement-breakpoint
CREATE INDEX "quick_replies_seller_idx" ON "quick_replies" USING btree ("seller_id") WHERE "quick_replies"."seller_id" is not null;--> statement-breakpoint
CREATE INDEX "quick_replies_system_idx" ON "quick_replies" USING btree ("is_system_template");--> statement-breakpoint
CREATE UNIQUE INDEX "notification_preferences_user_idx" ON "notification_preferences" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "push_device_unique_idx" ON "push_device_tokens" USING btree ("device_id","push_token");--> statement-breakpoint
CREATE UNIQUE INDEX "push_token_unique_idx" ON "push_device_tokens" USING btree ("push_token");--> statement-breakpoint
CREATE UNIQUE INDEX "push_device_user_idx" ON "push_device_tokens" USING btree ("user_id","device_id");--> statement-breakpoint
CREATE INDEX "order_addresses_order_idx" ON "order_addresses" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_items_parent_idx" ON "ordered_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_items_variant_idx" ON "ordered_items" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "order_notes_timeline_idx" ON "order_notes" USING btree ("order_id","created_at");--> statement-breakpoint
CREATE INDEX "order_notes_visibility_idx" ON "order_notes" USING btree ("visibility");--> statement-breakpoint
CREATE UNIQUE INDEX "orders_number_uniq_idx" ON "product_orders" USING btree ("order_number");--> statement-breakpoint
CREATE INDEX "orders_buyer_lookup_idx" ON "product_orders" USING btree ("buyer_id","placed_at");--> statement-breakpoint
CREATE INDEX "orders_seller_lookup_idx" ON "product_orders" USING btree ("seller_id","placed_at");--> statement-breakpoint
CREATE INDEX "orders_status_lookup_idx" ON "product_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payment_events_timeline_idx" ON "payment_events" USING btree ("payment_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "payments_ref_uniq_idx" ON "payments" USING btree ("payment_reference");--> statement-breakpoint
CREATE INDEX "payments_order_lookup_idx" ON "payments" USING btree ("order_id") WHERE "payments"."order_id" is not null;--> statement-breakpoint
CREATE INDEX "payments_payer_lookup_idx" ON "payments" USING btree ("payer_id");--> statement-breakpoint
CREATE INDEX "payments_gateway_ref_idx" ON "payments" USING btree ("gateway_reference") WHERE "payments"."gateway_reference" is not null;--> statement-breakpoint
CREATE INDEX "inventory_txn_variant_idx" ON "inventory_transactions" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "inventory_txn_ref_idx" ON "inventory_transactions" USING btree ("reference_type","reference_id") WHERE "inventory_transactions"."reference_id" is not null;--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_variant_uniq_idx" ON "inventory" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "prod_media_product_idx" ON "product_media" USING btree ("product_id","display_order");--> statement-breakpoint
CREATE INDEX "prod_media_variant_idx" ON "product_media" USING btree ("variant_id") WHERE "product_media"."variant_id" is not null;--> statement-breakpoint
CREATE UNIQUE INDEX "product_variants_sku_idx" ON "product_variants" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "product_variants_barcode_idx" ON "product_variants" USING btree ("barcode");--> statement-breakpoint
CREATE INDEX "product_variants_product_idx" ON "product_variants" USING btree ("product_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "products_seller_idx" ON "products" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "products_status_idx" ON "products" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "variant_attr_uniq_idx" ON "variant_attributes" USING btree ("variant_id","attribute_id");--> statement-breakpoint
CREATE INDEX "variant_attr_option_idx" ON "variant_attributes" USING btree ("option_id");--> statement-breakpoint
CREATE INDEX "review_images_parent_idx" ON "review_images" USING btree ("review_id","display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "reply_review_uniq_idx" ON "review_replies" USING btree ("review_id");--> statement-breakpoint
CREATE INDEX "review_replies_seller_idx" ON "review_replies" USING btree ("seller_id");--> statement-breakpoint
CREATE UNIQUE INDEX "review_order_item_uniq_idx" ON "reviews" USING btree ("order_item_id");--> statement-breakpoint
CREATE INDEX "reviews_product_idx" ON "reviews" USING btree ("product_id","status");--> statement-breakpoint
CREATE INDEX "reviews_seller_idx" ON "reviews" USING btree ("seller_id");--> statement-breakpoint
CREATE UNIQUE INDEX "brands_slug_idx" ON "brands" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "brands_seller_idx" ON "brands" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "seller_bank_accounts_seller_idx" ON "seller_bank_accounts" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "seller_bank_accounts_active_idx" ON "seller_bank_accounts" USING btree ("seller_id","is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_primary_account_per_seller" ON "seller_bank_accounts" USING btree ("seller_id") WHERE "seller_bank_accounts"."is_primary" = true;--> statement-breakpoint
CREATE INDEX "seller_documents_seller_idx" ON "seller_documents" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "seller_documents_status_idx" ON "seller_documents" USING btree ("status");--> statement-breakpoint
CREATE INDEX "seller_documents_type_idx" ON "seller_documents" USING btree ("document_type");--> statement-breakpoint
CREATE INDEX "seller_store_name_idx" ON "seller_store" USING btree ("store_name");--> statement-breakpoint
CREATE INDEX "seller_store_slug_idx" ON "seller_store" USING btree ("store_slug");--> statement-breakpoint
CREATE UNIQUE INDEX "subscription_plan_code_unique_idx" ON "subscription_plans" USING btree ("plan_code");--> statement-breakpoint
CREATE UNIQUE INDEX "subscription_plan_name_unique_idx" ON "subscription_plans" USING btree ("plan_name");
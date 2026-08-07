CREATE TYPE "public"."activity_type" AS ENUM('PRODUCT_CREATED', 'PRODUCT_UPDATED', 'PRODUCT_PUBLISHED', 'PRODUCT_ARCHIVED', 'ORDER_RECEIVED', 'ORDER_ACCEPTED', 'ORDER_COMPLETED', 'MESSAGE_RECEIVED', 'REVIEW_RECEIVED', 'STOCK_UPDATED', 'PROMOTION_CREATED', 'COUPON_CREATED', 'SUBSCRIPTION_STARTED', 'SUBSCRIPTION_RENEWED', 'PROFILE_UPDATED', 'SHOP_UPDATED', 'LOGIN', 'LOGOUT');--> statement-breakpoint
CREATE TYPE "public"."actor_type" AS ENUM('SELLER', 'BUYER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."activity_reference_type" AS ENUM('PRODUCT', 'ORDER', 'REVIEW', 'MESSAGE', 'PROMOTION', 'COUPON', 'SUBSCRIPTION');--> statement-breakpoint
CREATE TYPE "public"."activity_visibility" AS ENUM('PRIVATE', 'TEAM', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."audit_action" AS ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'PASSWORD_CHANGED', 'EMAIL_CHANGED', 'PHONE_CHANGED', 'ORDER_UPDATED', 'ORDER_CANCELLED', 'PRODUCT_UPDATED', 'PRODUCT_DELETED', 'SHOP_UPDATED', 'SUBSCRIPTION_UPDATED', 'ROLE_CHANGED', 'PERMISSION_CHANGED');--> statement-breakpoint
CREATE TYPE "public"."audit_actor_type" AS ENUM('SELLER', 'BUYER', 'ADMIN', 'SYSTEM');--> statement-breakpoint
CREATE TYPE "public"."audit_entity_type" AS ENUM('SELLER', 'BUYER', 'SHOP', 'PRODUCT', 'ORDER', 'ORDER_ITEM', 'MESSAGE', 'REVIEW', 'PROMOTION', 'SUBSCRIPTION', 'PAYMENT', 'DELIVERY');--> statement-breakpoint
CREATE TYPE "public"."attribute_input_type" AS ENUM('TEXT', 'TEXTAREA', 'NUMBER', 'DECIMAL', 'BOOLEAN', 'DATE', 'SELECT', 'MULTI_SELECT');--> statement-breakpoint
CREATE TYPE "public"."ai_moderation_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED');--> statement-breakpoint
CREATE TYPE "public"."attribute_data_type" AS ENUM('STRING', 'INTEGER', 'DECIMAL', 'BOOLEAN', 'DATE', 'JSON');--> statement-breakpoint
CREATE TYPE "public"."attribute_option_status" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TYPE "public"."catalog_status" AS ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."category_image_type" AS ENUM('COVER', 'BANNER', 'ICON');--> statement-breakpoint
CREATE TYPE "public"."category_visibility" AS ENUM('PUBLIC', 'PRIVATE');--> statement-breakpoint
CREATE TYPE "public"."dimension_unit" AS ENUM('CM', 'MM', 'IN');--> statement-breakpoint
CREATE TYPE "public"."product_image_status" AS ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."product_image_storage_provider" AS ENUM('SUPABASE', 'S3', 'CLOUDINARY', 'R2', 'LOCAL', 'CUSTOM');--> statement-breakpoint
CREATE TYPE "public"."product_image_type" AS ENUM('GALLERY', 'THUMBNAIL', 'COVER', 'DETAIL');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('DRAFT', 'PENDING_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'PUBLISHED', 'SUSPENDED', 'REJECTED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."product_type" AS ENUM('PHYSICAL', 'DIGITAL', 'SERVICE', 'GIFT_CARD');--> statement-breakpoint
CREATE TYPE "public"."product_variant_status" AS ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."product_video_status" AS ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."product_video_storage_provider" AS ENUM('SUPABASE', 'S3', 'CLOUDINARY', 'MUX', 'R2', 'LOCAL', 'CUSTOM');--> statement-breakpoint
CREATE TYPE "public"."product_video_type" AS ENUM('GALLERY', 'DEMO', 'TUTORIAL', 'PROMOTIONAL');--> statement-breakpoint
CREATE TYPE "public"."product_visibility" AS ENUM('PUBLIC', 'PRIVATE', 'UNLISTED');--> statement-breakpoint
CREATE TYPE "public"."robots_directive" AS ENUM('INDEX_FOLLOW', 'INDEX_NOFOLLOW', 'NOINDEX_FOLLOW', 'NOINDEX_NOFOLLOW');--> statement-breakpoint
CREATE TYPE "public"."shipping_class" AS ENUM('STANDARD', 'EXPRESS', 'HEAVY', 'OVERSIZED', 'COLD_CHAIN', 'CUSTOM');--> statement-breakpoint
CREATE TYPE "public"."weight_unit" AS ENUM('KG', 'G', 'LB', 'OZ');--> statement-breakpoint
CREATE TYPE "public"."pickup_status" AS ENUM('REQUESTED', 'SCHEDULED', 'COURIER_ASSIGNED', 'OUT_FOR_PICKUP', 'PICKED_UP', 'FAILED', 'RESCHEDULED', 'CANCELLED', 'ON_HOLD', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."shipment_status" AS ENUM('PENDING', 'READY_TO_SHIP', 'LABEL_GENERATED', 'MANIFEST_GENERATED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELIVERY_FAILED', 'RETURN_TO_ORIGIN', 'RETURNED', 'CANCELLED');--> statement-breakpoint
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
CREATE TYPE "public"."conversation_member_role" AS ENUM('SELLER', 'BUYER', 'ADMIN', 'SUPPORT', 'SYSTEM');--> statement-breakpoint
CREATE TYPE "public"."conversation_member_status" AS ENUM('ACTIVE', 'LEFT', 'REMOVED', 'BLOCKED');--> statement-breakpoint
CREATE TYPE "public"."conversation_notification_preference" AS ENUM('ALL_MESSAGES', 'MENTIONS_ONLY', 'MUTED');--> statement-breakpoint
CREATE TYPE "public"."conversation_status" AS ENUM('ACTIVE', 'ARCHIVED', 'BLOCKED', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."conversation_type" AS ENUM('DIRECT', 'ORDER', 'PRODUCT', 'SUPPORT');--> statement-breakpoint
CREATE TYPE "public"."conversation_last_message_type" AS ENUM('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'PRODUCT', 'ORDER', 'SYSTEM');--> statement-breakpoint
CREATE TYPE "public"."message_edit_status" AS ENUM('ORIGINAL', 'EDITED');--> statement-breakpoint
CREATE TYPE "public"."message_priority" AS ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT');--> statement-breakpoint
CREATE TYPE "public"."message_sender_type" AS ENUM('SELLER', 'BUYER', 'ADMIN', 'SUPPORT', 'SYSTEM', 'AI');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('SENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'DELETED');--> statement-breakpoint
CREATE TYPE "public"."message_type" AS ENUM('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'PRODUCT', 'ORDER', 'SYSTEM');--> statement-breakpoint
CREATE TYPE "public"."message_attachment_status" AS ENUM('UPLOADING', 'UPLOADED', 'PROCESSING', 'READY', 'FAILED', 'DELETED');--> statement-breakpoint
CREATE TYPE "public"."message_attachment_storage_provider" AS ENUM('SUPABASE', 'S3', 'LOCAL');--> statement-breakpoint
CREATE TYPE "public"."message_attachment_type" AS ENUM('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'PDF', 'SPREADSHEET', 'ARCHIVE', 'PRODUCT', 'ORDER', 'INVOICE', 'MANIFEST', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."message_read_source" AS ENUM('WEB', 'ANDROID', 'IOS', 'DESKTOP', 'SYSTEM');--> statement-breakpoint
CREATE TYPE "public"."message_read_status" AS ENUM('DELIVERED', 'READ');--> statement-breakpoint
CREATE TYPE "public"."message_read_sync_status" AS ENUM('PENDING', 'SYNCED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."message_reaction" AS ENUM('LIKE', 'LOVE', 'LAUGH', 'WOW', 'SAD', 'ANGRY', 'THUMBS_UP', 'THUMBS_DOWN', 'FIRE', 'HEART', 'PARTY', 'CLAP');--> statement-breakpoint
CREATE TYPE "public"."message_reaction_source" AS ENUM('WEB', 'ANDROID', 'IOS', 'DESKTOP', 'SYSTEM');--> statement-breakpoint
CREATE TYPE "public"."message_reaction_sync_status" AS ENUM('PENDING', 'SYNCED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."shared_product_price_status" AS ENUM('CURRENT', 'PRICE_CHANGED', 'DISCOUNT_APPLIED', 'UNAVAILABLE');--> statement-breakpoint
CREATE TYPE "public"."shared_product_source" AS ENUM('PRODUCT_PAGE', 'PRODUCT_CARD', 'SEARCH', 'CATEGORY', 'STORE', 'RECOMMENDATION', 'SYSTEM');--> statement-breakpoint
CREATE TYPE "public"."shared_product_status" AS ENUM('ACTIVE', 'PRODUCT_UPDATED', 'PRODUCT_UNAVAILABLE', 'PRODUCT_DELETED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."shared_order_delivery_status" AS ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."shared_order_payment_status" AS ENUM('PENDING', 'AUTHORIZED', 'PAID', 'PARTIALLY_PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'COD');--> statement-breakpoint
CREATE TYPE "public"."shared_order_source" AS ENUM('ORDER_DETAILS', 'ORDER_HISTORY', 'SELLER_DASHBOARD', 'BUYER_DASHBOARD', 'TRACKING_PAGE', 'SYSTEM');--> statement-breakpoint
CREATE TYPE "public"."shared_order_status" AS ENUM('ACTIVE', 'ORDER_UPDATED', 'ORDER_CANCELLED', 'ORDER_COMPLETED', 'ORDER_DELETED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."message_notification_delivery_status" AS ENUM('PENDING', 'DELIVERED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."message_notification_priority" AS ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT');--> statement-breakpoint
CREATE TYPE "public"."message_notification_source" AS ENUM('USER', 'SYSTEM', 'SELLER', 'BUYER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."message_notification_status" AS ENUM('UNREAD', 'READ', 'ARCHIVED', 'DELETED');--> statement-breakpoint
CREATE TYPE "public"."message_notification_type" AS ENUM('MESSAGE', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE', 'PRODUCT_SHARED', 'ORDER_SHARED', 'REACTION', 'MENTION', 'SYSTEM');--> statement-breakpoint
CREATE TYPE "public"."order_priority" AS ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT');--> statement-breakpoint
CREATE TYPE "public"."order_source" AS ENUM('WEB', 'ANDROID', 'IOS', 'ADMIN', 'API');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('DRAFT', 'PENDING', 'CONFIRMED', 'PROCESSING', 'READY_TO_SHIP', 'PARTIALLY_SHIPPED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURN_APPROVED', 'RETURN_REJECTED', 'RETURNED', 'REFUND_PENDING', 'REFUNDED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."order_payment_method" AS ENUM('COD', 'UPI', 'CARD', 'NET_BANKING', 'WALLET', 'BANK_TRANSFER');--> statement-breakpoint
CREATE TYPE "public"."order_payment_status" AS ENUM('PENDING', 'AUTHORIZED', 'PARTIALLY_PAID', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."shipping_method" AS ENUM('STANDARD', 'EXPRESS', 'SAME_DAY', 'NEXT_DAY', 'STORE_PICKUP');--> statement-breakpoint
CREATE TYPE "public"."order_address_type" AS ENUM('DELIVERY', 'BILLING');--> statement-breakpoint
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
CREATE TYPE "public"."invoice_status" AS ENUM('DRAFT', 'ISSUED', 'PAID', 'CANCELLED', 'VOID');--> statement-breakpoint
CREATE TYPE "public"."order_manifest_status" AS ENUM('GENERATED', 'DISPATCHED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."payment_capture_status" AS ENUM('NOT_REQUIRED', 'AUTHORIZED', 'CAPTURED', 'PARTIALLY_CAPTURED', 'FAILED', 'VOIDED');--> statement-breakpoint
CREATE TYPE "public"."payment_failure_category" AS ENUM('CUSTOMER', 'BANK', 'GATEWAY', 'NETWORK', 'SYSTEM', 'UNKNOWN');--> statement-breakpoint
CREATE TYPE "public"."payment_fraud_status" AS ENUM('NOT_CHECKED', 'LOW_RISK', 'MEDIUM_RISK', 'HIGH_RISK', 'BLOCKED');--> statement-breakpoint
CREATE TYPE "public"."order_payment_gateway" AS ENUM('RAZORPAY', 'PHONEPE', 'PAYTM', 'CASHFREE', 'STRIPE', 'COD', 'BANK_TRANSFER', 'UPI', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."payment_mode" AS ENUM('ONLINE', 'OFFLINE');--> statement-breakpoint
CREATE TYPE "public"."payment_transaction_type" AS ENUM('PAYMENT', 'PARTIAL_PAYMENT', 'CAPTURE', 'REFUND', 'PARTIAL_REFUND', 'REVERSAL', 'VOID', 'CHARGEBACK', 'CHARGEBACK_REVERSAL');--> statement-breakpoint
CREATE TYPE "public"."payment_verification_status" AS ENUM('PENDING', 'VERIFIED', 'FAILED', 'MANUAL_REVIEW');--> statement-breakpoint
CREATE TYPE "public"."settlement_status" AS ENUM('PENDING', 'PROCESSING', 'SETTLED', 'FAILED');--> statement-breakpoint
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
CREATE TYPE "public"."role" AS ENUM('seller', 'admin');--> statement-breakpoint
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
CREATE TYPE "public"."payment_methode" AS ENUM('UPI', 'CARD', 'NET_BANKING', 'WALLET', 'BANK_TRANSFER', 'EMI', 'PAY_LATER');--> statement-breakpoint
CREATE TYPE "public"."payments_status" AS ENUM('PENDING', 'AUTHORIZED', 'SUCCESS', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."feature_type" AS ENUM('BOOLEAN', 'INTEGER', 'DECIMAL', 'STRING', 'JSON');--> statement-breakpoint
CREATE TYPE "public"."billing_type" AS ENUM('TRIAL', 'MONTHLY', 'YEARLY', 'QUARTERLY', 'HALF_YEARLY');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female');--> statement-breakpoint
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
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(150) NOT NULL,
	"slug" varchar(180) NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text,
	"parent_id" uuid,
	"path" text NOT NULL,
	"level" integer DEFAULT 0 NOT NULL,
	"is_leaf" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" "catalog_status" DEFAULT 'ACTIVE' NOT NULL,
	"visibility" "category_visibility" DEFAULT 'PUBLIC' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "categories_level_check" CHECK ("categories"."level" >= 0),
	CONSTRAINT "categories_sort_order_check" CHECK ("categories"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid,
	"category_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"slug" varchar(220) NOT NULL,
	"status" "product_status" DEFAULT 'DRAFT' NOT NULL,
	"visibility" "product_visibility" DEFAULT 'PRIVATE' NOT NULL,
	"product_type" "product_type" DEFAULT 'PHYSICAL' NOT NULL,
	"short_description" varchar,
	"description" varchar,
	"is_featured" boolean DEFAULT false,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"reserved_quantity" integer DEFAULT 0,
	"low_stock_threshold" integer DEFAULT 0,
	"allow_backorder" boolean DEFAULT false,
	"last_adjusted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "product_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid,
	"storage_key" varchar,
	"cdn_url" varchar(2048) NOT NULL,
	"media_type" varchar DEFAULT 'IMAGE',
	"alt_text" varchar(500),
	"display_order" integer DEFAULT 0,
	"is_primary" boolean DEFAULT false,
	"status" varchar DEFAULT 'ACTIVE',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
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
CREATE TABLE "variant_attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"attribute_id" uuid NOT NULL,
	"option_id" uuid NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "product_variant_options_variant_id_check" CHECK ("variant_attributes"."variant_id" IS NOT NULL),
	CONSTRAINT "product_variant_options_attribute_id_check" CHECK ("variant_attributes"."attribute_id" IS NOT NULL),
	CONSTRAINT "product_variant_options_attribute_option_id_check" CHECK ("variant_attributes"."option_id" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"sku" varchar(120) NOT NULL,
	"barcode" varchar(128),
	"price" varchar,
	"compare_at_price" varchar,
	"cost_price" varchar,
	"weight_grams" integer,
	"status" "product_variant_status" DEFAULT 'ACTIVE' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "product_variants_sku_not_empty_check" CHECK (length(trim("product_variants"."sku")) > 0)
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
CREATE TABLE "conversation_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"role" "conversation_member_role" DEFAULT 'SELLER' NOT NULL,
	"status" "conversation_member_status" DEFAULT 'ACTIVE' NOT NULL,
	"nickname" varchar(150),
	"unread_count" integer DEFAULT 0 NOT NULL,
	"last_read_message_id" uuid,
	"last_read_at" timestamp with time zone,
	"notification_preference" "conversation_notification_preference" DEFAULT 'ALL_MESSAGES' NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_muted" boolean DEFAULT false NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"left_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "conversation_members_unread_count_chk" CHECK ("conversation_members"."unread_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"type" "conversation_type" DEFAULT 'DIRECT' NOT NULL,
	"status" "conversation_status" DEFAULT 'ACTIVE' NOT NULL,
	"title" varchar(200),
	"last_message_id" uuid,
	"last_message_type" "conversation_last_message_type",
	"last_message_preview" varchar(500),
	"last_message_at" timestamp with time zone,
	"unread_count" integer DEFAULT 0 NOT NULL,
	"participant_count" integer DEFAULT 0 NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_muted" boolean DEFAULT false NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "conversation_unread_count_chk" CHECK ("conversations"."unread_count" >= 0),
	CONSTRAINT "conversation_participant_count_chk" CHECK ("conversations"."participant_count" >= 1)
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"sender_type" "message_sender_type" DEFAULT 'SELLER' NOT NULL,
	"reply_to_message_id" uuid,
	"type" "message_type" DEFAULT 'TEXT' NOT NULL,
	"status" "message_status" DEFAULT 'SENDING' NOT NULL,
	"priority" "message_priority" DEFAULT 'NORMAL' NOT NULL,
	"text" text,
	"edit_status" "message_edit_status" DEFAULT 'ORIGINAL' NOT NULL,
	"edited_at" timestamp with time zone,
	"has_attachments" boolean DEFAULT false NOT NULL,
	"has_reactions" boolean DEFAULT false NOT NULL,
	"is_system_message" boolean DEFAULT false NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "messages_text_length_chk" CHECK ("text" IS NULL OR length("text") <= 10000)
);
--> statement-breakpoint
CREATE TABLE "message_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_id" uuid NOT NULL,
	"type" "message_attachment_type" DEFAULT 'IMAGE' NOT NULL,
	"status" "message_attachment_status" DEFAULT 'UPLOADING' NOT NULL,
	"storage_provider" "message_attachment_storage_provider" DEFAULT 'SUPABASE' NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"original_file_name" varchar(255) NOT NULL,
	"bucket" varchar(100) NOT NULL,
	"storage_path" varchar(500) NOT NULL,
	"content_type" varchar(150) NOT NULL,
	"file_size" bigint NOT NULL,
	"checksum" varchar(128),
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "message_attachments_file_size_chk" CHECK ("message_attachments"."file_size" > 0)
);
--> statement-breakpoint
CREATE TABLE "message_reads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"status" "message_read_status" DEFAULT 'DELIVERED' NOT NULL,
	"source" "message_read_source" DEFAULT 'WEB' NOT NULL,
	"sync_status" "message_read_sync_status" DEFAULT 'PENDING' NOT NULL,
	"device_id" varchar(150),
	"session_id" varchar(150),
	"ip_address" varchar(45),
	"user_agent" varchar(512),
	"delivered_at" timestamp with time zone DEFAULT now() NOT NULL,
	"read_at" timestamp with time zone,
	"synced_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "message_reads_read_after_delivered_chk" CHECK ("message_reads"."read_at" IS NULL OR "message_reads"."read_at" >= "message_reads"."delivered_at")
);
--> statement-breakpoint
CREATE TABLE "message_reactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"reaction" "message_reaction" NOT NULL,
	"source" "message_reaction_source" DEFAULT 'WEB' NOT NULL,
	"sync_status" "message_reaction_sync_status" DEFAULT 'PENDING' NOT NULL,
	"device_id" varchar(150),
	"session_id" varchar(150),
	"ip_address" varchar(45),
	"user_agent" varchar(512),
	"reacted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"synced_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "message_reactions_synced_after_reacted_chk" CHECK ("message_reactions"."synced_at" IS NULL OR "message_reactions"."synced_at" >= "message_reactions"."reacted_at")
);
--> statement-breakpoint
CREATE TABLE "shared_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_id" uuid NOT NULL,
	"product_id" uuid,
	"product_name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"sku" varchar(100),
	"brand" varchar(150),
	"thumbnail_url" varchar(2048),
	"currency" varchar(3) DEFAULT 'INR' NOT NULL,
	"selling_price" numeric(12, 2) NOT NULL,
	"mrp" numeric(12, 2),
	"status" "shared_product_status" DEFAULT 'ACTIVE' NOT NULL,
	"source" "shared_product_source" DEFAULT 'PRODUCT_PAGE' NOT NULL,
	"price_status" "shared_product_price_status" DEFAULT 'CURRENT' NOT NULL,
	"shared_count" bigint DEFAULT 1 NOT NULL,
	"opened_count" bigint DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"shared_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shared_products_selling_price_chk" CHECK ("shared_products"."selling_price" >= 0),
	CONSTRAINT "shared_products_mrp_chk" CHECK ("shared_products"."mrp" IS NULL OR "shared_products"."mrp" >= "shared_products"."selling_price"),
	CONSTRAINT "shared_products_shared_count_chk" CHECK ("shared_products"."shared_count" >= 1),
	CONSTRAINT "shared_products_opened_count_chk" CHECK ("shared_products"."opened_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "shared_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_id" uuid NOT NULL,
	"order_id" uuid,
	"order_number" varchar(100) NOT NULL,
	"buyer_name" varchar(200),
	"seller_name" varchar(200),
	"currency" varchar(3) DEFAULT 'INR' NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"status" "shared_order_status" DEFAULT 'ACTIVE' NOT NULL,
	"source" "shared_order_source" DEFAULT 'ORDER_DETAILS' NOT NULL,
	"delivery_status" "shared_order_delivery_status" NOT NULL,
	"payment_status" "shared_order_payment_status" NOT NULL,
	"tracking_number" varchar(150),
	"courier_name" varchar(150),
	"shared_count" bigint DEFAULT 1 NOT NULL,
	"opened_count" bigint DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"shared_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shared_orders_total_amount_chk" CHECK ("shared_orders"."total_amount" >= 0),
	CONSTRAINT "shared_orders_shared_count_chk" CHECK ("shared_orders"."shared_count" >= 1),
	CONSTRAINT "shared_orders_opened_count_chk" CHECK ("shared_orders"."opened_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "message_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipient_seller_id" uuid NOT NULL,
	"sender_seller_id" uuid,
	"conversation_id" uuid,
	"message_id" uuid,
	"type" "message_notification_type" NOT NULL,
	"status" "message_notification_status" DEFAULT 'UNREAD' NOT NULL,
	"priority" "message_notification_priority" DEFAULT 'NORMAL' NOT NULL,
	"source" "message_notification_source" DEFAULT 'SYSTEM' NOT NULL,
	"delivery_status" "message_notification_delivery_status" DEFAULT 'PENDING' NOT NULL,
	"title" varchar(200) NOT NULL,
	"body" varchar(1000) NOT NULL,
	"image_url" varchar(2048),
	"action_url" varchar(2048),
	"icon" varchar(100),
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"failed_at" timestamp with time zone,
	"retry_count" bigint DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "message_notifications_retry_count_chk" CHECK ("message_notifications"."retry_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "product_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"buyer_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"shipping_address_id" uuid NOT NULL,
	"billing_address_id" uuid,
	"order_number" varchar(100) NOT NULL,
	"status" "order_status" DEFAULT 'PENDING' NOT NULL,
	"payment_status" "order_payment_status" DEFAULT 'PENDING' NOT NULL,
	"payment_method" "order_payment_method" DEFAULT 'COD' NOT NULL,
	"shipping_method" "shipping_method" DEFAULT 'STANDARD' NOT NULL,
	"priority" "order_priority" DEFAULT 'NORMAL' NOT NULL,
	"source" "order_source" DEFAULT 'WEB' NOT NULL,
	"currency" varchar(10) DEFAULT 'INR' NOT NULL,
	"buyer_name" varchar(255) NOT NULL,
	"buyer_email" varchar(320) NOT NULL,
	"buyer_phone" varchar(20) NOT NULL,
	"subtotal" numeric(18, 2) NOT NULL,
	"discount_amount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"coupon_discount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"shipping_charge" numeric(18, 2) DEFAULT '0' NOT NULL,
	"tax_amount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"grand_total" numeric(18, 2) NOT NULL,
	"is_gift" boolean DEFAULT false NOT NULL,
	"gift_message" text,
	"requires_signature" boolean DEFAULT false NOT NULL,
	"seller_remark" text,
	"internal_remark" text,
	"expected_delivery_date" timestamp with time zone,
	"actual_delivery_date" timestamp with time zone,
	"accepted_at" timestamp with time zone,
	"packed_at" timestamp with time zone,
	"ready_at" timestamp with time zone,
	"shipped_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"returned_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
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
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid,
	"sku" varchar(120) NOT NULL,
	"variant_sku" varchar(120),
	"product_slug" varchar(255) NOT NULL,
	"product_name" varchar(255) NOT NULL,
	"variant_name" varchar(255),
	"brand_name" varchar(150),
	"category_name" varchar(150),
	"thumbnail_url" text,
	"image_url" text,
	"snapshot_source" "order_item_snapshot_source" DEFAULT 'PRODUCT' NOT NULL,
	"currency" varchar(3) DEFAULT 'INR' NOT NULL,
	"unit_price" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"compare_at_price" numeric(12, 2),
	"discount_type" "order_item_discount_type" DEFAULT 'NONE' NOT NULL,
	"discount_amount" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"tax_type" "order_item_tax_type" DEFAULT 'NONE' NOT NULL,
	"tax_rate" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"tax_amount" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"subtotal" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"total" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"weight" numeric(10, 3),
	"length" numeric(10, 2),
	"width" numeric(10, 2),
	"height" numeric(10, 2),
	"inventory_location" varchar(255),
	"warehouse_name" varchar(255),
	"fulfillment_type" "order_item_fulfillment_type" DEFAULT 'STANDARD' NOT NULL,
	"item_status" "order_item_status" DEFAULT 'PENDING' NOT NULL,
	"seller_sku" varchar(120),
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
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
CREATE TABLE "seller" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"role" "role" DEFAULT 'seller' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "seller_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "seller_pass_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	CONSTRAINT "seller_pass_reset_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"refresh_token" text NOT NULL,
	"user_agent" text,
	"ip_address" text,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"revoked_at" timestamp,
	"refresh_token_version" integer DEFAULT 0 NOT NULL,
	"last_rotated_at" timestamp,
	CONSTRAINT "sessions_refresh_token_unique" UNIQUE("refresh_token")
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
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid,
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
	"deleted_at" timestamp with time zone,
	CONSTRAINT "seller_store_seller_id_unique" UNIQUE("seller_id"),
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
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"image_url" text,
	"mobile_number" text,
	"gender" "gender" DEFAULT 'male' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_attribute_options" ADD CONSTRAINT "category_attribute_options_attribute_id_category_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."category_attributes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_attributes" ADD CONSTRAINT "category_attributes_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_created_by_seller_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_updated_by_seller_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_seller_id_seller_store_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller_store"("seller_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
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
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_seo" ADD CONSTRAINT "product_seo_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_seo" ADD CONSTRAINT "product_seo_created_by_seller_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_seo" ADD CONSTRAINT "product_seo_updated_by_seller_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_tag_mappings" ADD CONSTRAINT "product_tag_mappings_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_tag_mappings" ADD CONSTRAINT "product_tag_mappings_tag_id_product_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."product_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_tag_mappings" ADD CONSTRAINT "product_tag_mappings_created_by_seller_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_created_by_seller_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_updated_by_seller_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_attributes" ADD CONSTRAINT "variant_attributes_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_attributes" ADD CONSTRAINT "variant_attributes_attribute_id_category_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."category_attributes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_attributes" ADD CONSTRAINT "variant_attributes_option_id_category_attribute_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."category_attribute_options"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_attributes" ADD CONSTRAINT "variant_attributes_created_by_seller_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_attributes" ADD CONSTRAINT "variant_attributes_updated_by_seller_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_videos" ADD CONSTRAINT "product_videos_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_videos" ADD CONSTRAINT "product_videos_created_by_seller_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_videos" ADD CONSTRAINT "product_videos_updated_by_seller_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping" ADD CONSTRAINT "shipping_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping" ADD CONSTRAINT "shipping_created_by_seller_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping" ADD CONSTRAINT "shipping_updated_by_seller_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
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
ALTER TABLE "conversation_members" ADD CONSTRAINT "conversation_members_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_members" ADD CONSTRAINT "conversation_members_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_seller_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."seller"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_attachments" ADD CONSTRAINT "message_attachments_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_reactions" ADD CONSTRAINT "message_reactions_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_reactions" ADD CONSTRAINT "message_reactions_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_products" ADD CONSTRAINT "shared_products_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_products" ADD CONSTRAINT "shared_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_orders" ADD CONSTRAINT "shared_orders_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_orders" ADD CONSTRAINT "shared_orders_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_notifications" ADD CONSTRAINT "message_notifications_recipient_seller_id_seller_id_fk" FOREIGN KEY ("recipient_seller_id") REFERENCES "public"."seller"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_notifications" ADD CONSTRAINT "message_notifications_sender_seller_id_seller_id_fk" FOREIGN KEY ("sender_seller_id") REFERENCES "public"."seller"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_notifications" ADD CONSTRAINT "message_notifications_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_notifications" ADD CONSTRAINT "message_notifications_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_orders" ADD CONSTRAINT "product_orders_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_orders" ADD CONSTRAINT "product_orders_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_orders" ADD CONSTRAINT "product_orders_store_id_seller_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."seller_store"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_orders" ADD CONSTRAINT "product_orders_shipping_address_id_seller_addresses_id_fk" FOREIGN KEY ("shipping_address_id") REFERENCES "public"."seller_addresses"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_orders" ADD CONSTRAINT "product_orders_billing_address_id_seller_addresses_id_fk" FOREIGN KEY ("billing_address_id") REFERENCES "public"."seller_addresses"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_addresses" ADD CONSTRAINT "order_addresses_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
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
ALTER TABLE "order_invoices" ADD CONSTRAINT "order_invoices_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_invoices" ADD CONSTRAINT "order_invoices_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_manifest_items" ADD CONSTRAINT "order_manifest_items_manifest_id_order_manifests_id_fk" FOREIGN KEY ("manifest_id") REFERENCES "public"."order_manifests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_manifest_items" ADD CONSTRAINT "order_manifest_items_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_manifests" ADD CONSTRAINT "order_manifests_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
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
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_item_id_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_id_product_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."product_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_pass_reset_tokens" ADD CONSTRAINT "seller_pass_reset_tokens_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
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
CREATE UNIQUE INDEX "cat_attr_options_val_idx" ON "category_attribute_options" USING btree ("attribute_id","value");--> statement-breakpoint
CREATE UNIQUE INDEX "cat_attr_category_slug_idx" ON "category_attributes" USING btree ("category_id","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
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
CREATE UNIQUE INDEX "products_slug_uidx" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "products_category_listing_idx" ON "products" USING btree ("category_id","visibility","status","created_at");--> statement-breakpoint
CREATE INDEX "products_store_updated_idx" ON "products" USING btree ("seller_id","updated_at");--> statement-breakpoint
CREATE INDEX "products_store_idx" ON "products" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "products_store_status_idx" ON "products" USING btree ("seller_id","status");--> statement-breakpoint
CREATE INDEX "products_visibility_status_idx" ON "products" USING btree ("visibility","status");--> statement-breakpoint
CREATE INDEX "products_category_status_idx" ON "products" USING btree ("category_id","status");--> statement-breakpoint
CREATE INDEX "products_category_visibility_status_idx" ON "products" USING btree ("category_id","visibility","status");--> statement-breakpoint
CREATE INDEX "products_type_status_idx" ON "products" USING btree ("product_type","status");--> statement-breakpoint
CREATE INDEX "products_deleted_at_idx" ON "products" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_variant_uidx" ON "inventory" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "inventory_variant_idx" ON "inventory" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "inventory_created_at_idx" ON "inventory" USING btree ("created_at");--> statement-breakpoint
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
CREATE INDEX "product_images_product_idx" ON "product_media" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_images_product_display_order_idx" ON "product_media" USING btree ("product_id","display_order");--> statement-breakpoint
CREATE INDEX "product_images_product_status_idx" ON "product_media" USING btree ("product_id","status");--> statement-breakpoint
CREATE INDEX "product_images_primary_idx" ON "product_media" USING btree ("product_id","is_primary");--> statement-breakpoint
CREATE INDEX "product_images_created_at_idx" ON "product_media" USING btree ("created_at");--> statement-breakpoint
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
CREATE UNIQUE INDEX "product_variants_product_sku_uidx" ON "product_variants" USING btree ("product_id","sku");--> statement-breakpoint
CREATE UNIQUE INDEX "product_variants_barcode_uidx" ON "product_variants" USING btree ("barcode");--> statement-breakpoint
CREATE INDEX "product_variants_product_idx" ON "product_variants" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_variants_product_status_idx" ON "product_variants" USING btree ("product_id","status");--> statement-breakpoint
CREATE INDEX "product_variants_sku_idx" ON "product_variants" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "product_variants_created_at_idx" ON "product_variants" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "product_variants_deleted_at_idx" ON "product_variants" USING btree ("deleted_at");--> statement-breakpoint
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
CREATE UNIQUE INDEX "promotion_product_unique_idx" ON "promotion_products" USING btree ("promotion_id","product_id");--> statement-breakpoint
CREATE INDEX "promotions_seller_idx" ON "promotions" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "promotions_status_idx" ON "promotions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "promotions_coupon_idx" ON "promotions" USING btree ("coupon_code");--> statement-breakpoint
CREATE INDEX "promotions_schedule_idx" ON "promotions" USING btree ("starts_at","ends_at");--> statement-breakpoint
CREATE UNIQUE INDEX "referral_code_unique_idx" ON "referral_codes" USING btree ("referral_code");--> statement-breakpoint
CREATE UNIQUE INDEX "referral_owner_campaign_idx" ON "referral_codes" USING btree ("owner_id","campaign_name");--> statement-breakpoint
CREATE UNIQUE INDEX "conversation_members_uidx" ON "conversation_members" USING btree ("conversation_id","seller_id");--> statement-breakpoint
CREATE INDEX "conversation_members_conversation_idx" ON "conversation_members" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "conversation_members_seller_idx" ON "conversation_members" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "conversation_members_role_idx" ON "conversation_members" USING btree ("role");--> statement-breakpoint
CREATE INDEX "conversation_members_status_idx" ON "conversation_members" USING btree ("status");--> statement-breakpoint
CREATE INDEX "conversation_members_joined_at_idx" ON "conversation_members" USING btree ("joined_at");--> statement-breakpoint
CREATE UNIQUE INDEX "conversation_seller_last_message_uidx" ON "conversations" USING btree ("seller_id","last_message_id");--> statement-breakpoint
CREATE INDEX "conversation_seller_idx" ON "conversations" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "conversation_type_idx" ON "conversations" USING btree ("type");--> statement-breakpoint
CREATE INDEX "conversation_status_idx" ON "conversations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "conversation_last_message_at_idx" ON "conversations" USING btree ("last_message_at");--> statement-breakpoint
CREATE INDEX "conversation_created_at_idx" ON "conversations" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "messages_conversation_idx" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "messages_sender_idx" ON "messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "messages_sender_type_idx" ON "messages" USING btree ("sender_type");--> statement-breakpoint
CREATE INDEX "messages_status_idx" ON "messages" USING btree ("status");--> statement-breakpoint
CREATE INDEX "messages_type_idx" ON "messages" USING btree ("type");--> statement-breakpoint
CREATE INDEX "messages_priority_idx" ON "messages" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "messages_reply_to_message_idx" ON "messages" USING btree ("reply_to_message_id");--> statement-breakpoint
CREATE INDEX "message_attachments_message_idx" ON "message_attachments" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "message_attachments_type_idx" ON "message_attachments" USING btree ("type");--> statement-breakpoint
CREATE INDEX "message_attachments_status_idx" ON "message_attachments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "message_attachments_storage_provider_idx" ON "message_attachments" USING btree ("storage_provider");--> statement-breakpoint
CREATE INDEX "message_attachments_created_at_idx" ON "message_attachments" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "message_reads_message_seller_uidx" ON "message_reads" USING btree ("message_id","seller_id");--> statement-breakpoint
CREATE INDEX "message_reads_message_idx" ON "message_reads" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "message_reads_seller_idx" ON "message_reads" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "message_reads_status_idx" ON "message_reads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "message_reads_source_idx" ON "message_reads" USING btree ("source");--> statement-breakpoint
CREATE INDEX "message_reads_sync_status_idx" ON "message_reads" USING btree ("sync_status");--> statement-breakpoint
CREATE INDEX "message_reads_delivered_at_idx" ON "message_reads" USING btree ("delivered_at");--> statement-breakpoint
CREATE INDEX "message_reads_read_at_idx" ON "message_reads" USING btree ("read_at");--> statement-breakpoint
CREATE UNIQUE INDEX "message_reactions_message_seller_uidx" ON "message_reactions" USING btree ("message_id","seller_id");--> statement-breakpoint
CREATE INDEX "message_reactions_message_idx" ON "message_reactions" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "message_reactions_seller_idx" ON "message_reactions" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "message_reactions_reaction_idx" ON "message_reactions" USING btree ("reaction");--> statement-breakpoint
CREATE INDEX "message_reactions_source_idx" ON "message_reactions" USING btree ("source");--> statement-breakpoint
CREATE INDEX "message_reactions_sync_status_idx" ON "message_reactions" USING btree ("sync_status");--> statement-breakpoint
CREATE INDEX "message_reactions_reacted_at_idx" ON "message_reactions" USING btree ("reacted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "shared_products_message_uidx" ON "shared_products" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "shared_products_product_idx" ON "shared_products" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "shared_products_message_idx" ON "shared_products" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "shared_products_status_idx" ON "shared_products" USING btree ("status");--> statement-breakpoint
CREATE INDEX "shared_products_source_idx" ON "shared_products" USING btree ("source");--> statement-breakpoint
CREATE INDEX "shared_products_shared_at_idx" ON "shared_products" USING btree ("shared_at");--> statement-breakpoint
CREATE UNIQUE INDEX "shared_orders_message_uidx" ON "shared_orders" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "shared_orders_order_idx" ON "shared_orders" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "shared_orders_message_idx" ON "shared_orders" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "shared_orders_status_idx" ON "shared_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "shared_orders_delivery_status_idx" ON "shared_orders" USING btree ("delivery_status");--> statement-breakpoint
CREATE INDEX "shared_orders_payment_status_idx" ON "shared_orders" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "shared_orders_source_idx" ON "shared_orders" USING btree ("source");--> statement-breakpoint
CREATE INDEX "shared_orders_shared_at_idx" ON "shared_orders" USING btree ("shared_at");--> statement-breakpoint
CREATE INDEX "message_notifications_recipient_idx" ON "message_notifications" USING btree ("recipient_seller_id");--> statement-breakpoint
CREATE INDEX "message_notifications_sender_idx" ON "message_notifications" USING btree ("sender_seller_id");--> statement-breakpoint
CREATE INDEX "message_notifications_conversation_idx" ON "message_notifications" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "message_notifications_message_idx" ON "message_notifications" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "message_notifications_type_idx" ON "message_notifications" USING btree ("type");--> statement-breakpoint
CREATE INDEX "message_notifications_status_idx" ON "message_notifications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "message_notifications_priority_idx" ON "message_notifications" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "message_notifications_delivery_status_idx" ON "message_notifications" USING btree ("delivery_status");--> statement-breakpoint
CREATE INDEX "message_notifications_read_idx" ON "message_notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "message_notifications_created_at_idx" ON "message_notifications" USING btree ("created_at");--> statement-breakpoint
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
CREATE INDEX "order_addresses_order_idx" ON "order_addresses" USING btree ("order_id");--> statement-breakpoint
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
CREATE INDEX "order_invoices_order_idx" ON "order_invoices" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_invoices_seller_idx" ON "order_invoices" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "order_invoices_number_idx" ON "order_invoices" USING btree ("invoice_number");--> statement-breakpoint
CREATE INDEX "order_manifest_items_manifest_idx" ON "order_manifest_items" USING btree ("manifest_id");--> statement-breakpoint
CREATE INDEX "order_manifest_items_order_idx" ON "order_manifest_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_manifests_seller_idx" ON "order_manifests" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "order_manifests_number_idx" ON "order_manifests" USING btree ("manifest_number");--> statement-breakpoint
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
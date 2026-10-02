// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/message-attachments/types.ts
// Description:
// Shared TypeScript types derived from Message Attachment constants.
// ============================================================================

import {
    MESSAGE_ATTACHMENT_AUDIO_MIME_TYPES,
    MESSAGE_ATTACHMENT_CONTENT_TYPE_MAX_LENGTH,
    MESSAGE_ATTACHMENT_DOCUMENT_MIME_TYPES,
    MESSAGE_ATTACHMENT_IMAGE_MIME_TYPES,
    MESSAGE_ATTACHMENT_STATUSES,
    MESSAGE_ATTACHMENT_STORAGE_PROVIDERS,
    MESSAGE_ATTACHMENT_TYPES,
    MESSAGE_ATTACHMENT_VIDEO_MIME_TYPES,
} from "./constants";

/**
 * ============================================================================
 * Message Attachment
 * ============================================================================
 */

export type MessageAttachmentType =
    (typeof MESSAGE_ATTACHMENT_TYPES)[number];

export type MessageAttachmentStatus =
    (typeof MESSAGE_ATTACHMENT_STATUSES)[number];

export type MessageAttachmentStorageProvider =
    (typeof MESSAGE_ATTACHMENT_STORAGE_PROVIDERS)[number];

export type MessageAttachmentImageMimeType =
    (typeof MESSAGE_ATTACHMENT_IMAGE_MIME_TYPES)[number];

export type MessageAttachmentVideoMimeType =
    (typeof MESSAGE_ATTACHMENT_VIDEO_MIME_TYPES)[number];

export type MessageAttachmentAudioMimeType =
    (typeof MESSAGE_ATTACHMENT_AUDIO_MIME_TYPES)[number];

export type MessageAttachmentDocumentMimeType =
    (typeof MESSAGE_ATTACHMENT_DOCUMENT_MIME_TYPES)[number];

/**
 * ============================================================================
 * Union MIME Type
 * ============================================================================
 */

export type MessageAttachmentMimeType =
    | MessageAttachmentImageMimeType
    | MessageAttachmentVideoMimeType
    | MessageAttachmentAudioMimeType
    | MessageAttachmentDocumentMimeType;

/**
 * ============================================================================
 * Constant Maps
 * ============================================================================
 */

export const MessageAttachmentType =
    MESSAGE_ATTACHMENT_TYPES.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            MessageAttachmentType,
            MessageAttachmentType
        >,
    );

export const MessageAttachmentStatus =
    MESSAGE_ATTACHMENT_STATUSES.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            MessageAttachmentStatus,
            MessageAttachmentStatus
        >,
    );

export const MessageAttachmentStorageProvider =
    MESSAGE_ATTACHMENT_STORAGE_PROVIDERS.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            MessageAttachmentStorageProvider,
            MessageAttachmentStorageProvider
        >,
    );

export const MessageAttachmentImageMimeType =
    MESSAGE_ATTACHMENT_IMAGE_MIME_TYPES.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            MessageAttachmentImageMimeType,
            MessageAttachmentImageMimeType
        >,
    );

export const MessageAttachmentVideoMimeType =
    MESSAGE_ATTACHMENT_VIDEO_MIME_TYPES.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            MessageAttachmentVideoMimeType,
            MessageAttachmentVideoMimeType
        >,
    );

export const MessageAttachmentAudioMimeType =
    MESSAGE_ATTACHMENT_AUDIO_MIME_TYPES.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            MessageAttachmentAudioMimeType,
            MessageAttachmentAudioMimeType
        >,
    );

export const MessageAttachmentDocumentMimeType =
    MESSAGE_ATTACHMENT_DOCUMENT_MIME_TYPES.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            MessageAttachmentDocumentMimeType,
            MessageAttachmentDocumentMimeType
        >,
    );

/**
 * ============================================================================
 * Attachment Constraints
 * ============================================================================
 */

export interface MessageAttachmentConstraints {
    readonly maxContentTypeLength: typeof MESSAGE_ATTACHMENT_CONTENT_TYPE_MAX_LENGTH;
}

export const MessageAttachmentConstraints: MessageAttachmentConstraints =
    Object.freeze({
        maxContentTypeLength:
        MESSAGE_ATTACHMENT_CONTENT_TYPE_MAX_LENGTH,
    });
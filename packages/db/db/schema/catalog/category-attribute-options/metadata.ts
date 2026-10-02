/**
 * ============================================================
 * Category Attribute Option Metadata
 * ============================================================
 *
 * Typed JSON stored inside
 * category_attribute_options.metadata
 *
 * ============================================================
 */

export interface AttributeOptionUiMetadata {
    badgeColor?: string;

    tooltip?: string;

    cssClass?: string;

    icon?: string;
}

export interface AttributeOptionAiMetadata {
    synonyms?: string[];

    promptHint?: string;
}

export interface CategoryAttributeOptionMetadata {
    ui?: AttributeOptionUiMetadata;

    ai?: AttributeOptionAiMetadata;

    custom?: Record<string, unknown>;
}
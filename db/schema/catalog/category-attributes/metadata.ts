/**
 * ============================================================
 * Category Attribute Metadata
 * ============================================================
 *
 * Typed JSON stored inside category_attributes.metadata
 *
 * ============================================================
 */

export interface AttributeValidationMetadata {
    regex?: string;

    minimum?: number;

    maximum?: number;

    minimumLength?: number;

    maximumLength?: number;

    step?: number;
}

export interface AttributeUiMetadata {
    width?: "full" | "half" | "third";

    collapsible?: boolean;

    cssClass?: string;

    icon?: string;
}

export interface AttributeAiMetadata {
    suggested?: boolean;

    promptHint?: string;
}

export interface CategoryAttributeMetadata {
    validation?: AttributeValidationMetadata;

    ui?: AttributeUiMetadata;

    ai?: AttributeAiMetadata;

    custom?: Record<string, unknown>;
}

export interface AttributeValidationMetadata {
    regex?: string;

    minimum?: number;

    maximum?: number;

    minimumLength?: number;

    maximumLength?: number;

    step?: number;

    defaultValue?: unknown;
}
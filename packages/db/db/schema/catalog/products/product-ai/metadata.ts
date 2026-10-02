/**
 * ============================================================
 * Product AI Metadata
 * ============================================================
 */

export interface ProductAiPromptMetadata {
    /**
     * Prompt template identifier.
     */
    template?: string;

    /**
     * Prompt version.
     */
    version?: string;
}

export interface ProductAiUsageMetadata {
    /**
     * Input tokens.
     */
    promptTokens?: number;

    /**
     * Output tokens.
     */
    completionTokens?: number;

    /**
     * Total tokens.
     */
    totalTokens?: number;

    /**
     * Processing latency.
     */
    latencyMs?: number;
}

export interface ProductAiConfidenceMetadata {
    /**
     * Overall confidence.
     */
    overall?: number;

    /**
     * Confidence by section.
     */
    fields?: Record<
        string,
        number
    >;
}

export interface ProductAiMetadata {
    /**
     * Prompt information.
     */
    prompt?: ProductAiPromptMetadata;

    /**
     * Token usage.
     */
    usage?: ProductAiUsageMetadata;

    /**
     * AI confidence.
     */
    confidence?: ProductAiConfidenceMetadata;

    /**
     * Provider specific data.
     */
    provider?: Record<
        string,
        unknown
    >;

    /**
     * Future extensions.
     */
    custom?: Record<
        string,
        unknown
    >;
}
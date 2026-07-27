export interface AuditMetadataDto {
    createdBy: string;
    updatedBy: string;
}

export interface VersionMetadataDto {
    version: number;
}

export interface SeoMetadataDto {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
}
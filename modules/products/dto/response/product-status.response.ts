export interface ProductStatusDto {
    id: string;

    status: string;

    visibility: string;

    isAvailable: boolean;

    publishedAt: Date | null;

    archivedAt: Date | null;
}
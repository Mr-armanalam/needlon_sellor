export interface IdDto {
    id: string;
}

export interface SlugDto {
    slug: string;
}

export interface TimestampDto {
    createdAt: string;
    updatedAt: string;
}

export interface SoftDeleteDto {
    deletedAt: string | null;
}

export interface StatusDto<TStatus extends string> {
    status: TStatus;
}
import { ReactNode } from "react";

export type ImageUploadVariant =
    | "avatar"
    | "logo"
    | "banner";

export interface ImageUploadProps {
    imageUrl?: string | null;

    variant: ImageUploadVariant;

    title: string;

    description?: string;

    onUpload(
        file: File,
    ): Promise<void>;

    isUploading?: boolean;

    children?: ReactNode;
    accept?: string;

    disabled?: boolean;

    className?: string;

    placeholder?: ReactNode;
}
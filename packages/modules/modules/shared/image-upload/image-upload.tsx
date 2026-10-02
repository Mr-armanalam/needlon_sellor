"use client";

import { ImageDropzone } from "./image-dropzone";
import { ImagePreview } from "./image-preview";
import { ImageUploadProps } from "./image-type";

export function ImageUpload({
                                imageUrl,
                                variant,
                                title,
                                description,
                                onUpload,
                                isUploading,
                                accept,
                                disabled,
                                placeholder,
                                className,
                            }: ImageUploadProps) {
    const isBanner =
        variant === "banner";

    if (isBanner) {
        return (
            <div className={className}>
                <ImageDropzone
                    variant={variant}
                    title={title}
                    description={description}
                    accept={accept}
                    disabled={disabled}
                    onUpload={onUpload}
                >
                    <ImagePreview
                        imageUrl={imageUrl}
                        variant={variant}
                        isUploading={isUploading}
                        placeholder={placeholder}
                    />
                </ImageDropzone>
            </div>
        );
    }

    return (
        <div
           key={imageUrl+variant} className={`flex items-center gap-4 ${className ?? ""}`}
        >
            <ImagePreview
                imageUrl={imageUrl}
                variant={variant}
                isUploading={isUploading}
                placeholder={placeholder}
            />

            <ImageDropzone
                variant={variant}
                title={title}
                description={description}
                accept={accept}
                disabled={disabled}
                onUpload={onUpload}
            />
        </div>
    );
}
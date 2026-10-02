"use client";

import Image from "next/image";
import { Camera } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";

import { IMAGE_VARIANTS } from "./image-variants";
import { ImageUploadVariant } from "./image-type";

interface Props {
    imageUrl?: string | null;

    variant: ImageUploadVariant;

    isUploading?: boolean;

    placeholder?: React.ReactNode;
}

export function ImagePreview({
                                 imageUrl,
                                 variant,
                                 isUploading,
                                 placeholder,
                             }: Props) {
    const styles =
        IMAGE_VARIANTS[variant];

    return (
        <div
            className={`
                relative
                overflow-hidden
                border
                border-gray-200
                bg-slate-50
                flex
                items-center
                justify-center
                ${styles.preview}
            `}
        >
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover"
                />
            ) : (
                placeholder ?? (
                    <Camera
                        className={`${styles.icon} text-gray-400`}
                    />
                )
            )}

            {isUploading && (
                <div
                    className={`
                        absolute
                        inset-0
                        bg-black/20
                        flex
                        items-center
                        justify-center
                        ${styles.overlay}
                    `}
                >
                    <Spinner />
                </div>
            )}
        </div>
    );
}
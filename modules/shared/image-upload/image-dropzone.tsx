"use client";

import {
    ReactNode,
    useCallback,
    useRef,
    useState,
} from "react";

import { Upload } from "lucide-react";

import { IMAGE_VARIANTS } from "./image-variants";
import { ImageUploadVariant } from "./image-type";

interface Props {
    variant: ImageUploadVariant;

    title: string;

    description?: string;

    accept?: string;
    children?: ReactNode
    ;
    disabled?: boolean;

    onUpload(
        file: File,
    ): Promise<void>;
}

export function ImageDropzone({
                                  variant,
                                  title,
                                  description,
                                  accept = "image/*",
                                  disabled,
                                  onUpload,
                              }: Props) {
    const inputRef =
        useRef<HTMLInputElement>(null);

    const [dragActive, setDragActive] =
        useState(false);

    const styles =
        IMAGE_VARIANTS[variant];

    const uploadFile =
        useCallback(
            async (
                file?: File,
            ) => {
                if (
                    !file ||
                    disabled
                ) {
                    return;
                }

                await onUpload(file);
            },
            [
                disabled,
                onUpload,
            ],
        );

    const openPicker =
        useCallback(() => {
            if (disabled) {
                return;
            }

            inputRef.current?.click();
        }, [disabled]);

    const handleChange =
        useCallback(
            async (
                event: React.ChangeEvent<HTMLInputElement>,
            ) => {
                await uploadFile(
                    event.target.files?.[0],
                );

                event.target.value = "";
            },
            [uploadFile],
        );

    const handleDrop =
        useCallback(
            async (
                event: React.DragEvent<HTMLDivElement>,
            ) => {
                event.preventDefault();
                event.stopPropagation();

                setDragActive(false);

                await uploadFile(
                    event.dataTransfer.files?.[0],
                );
            },
            [uploadFile],
        );

    const handleDrag =
        useCallback(
            (
                event: React.DragEvent<HTMLDivElement>,
            ) => {
                event.preventDefault();
                event.stopPropagation();

                switch (event.type) {
                    case "dragenter":
                    case "dragover":
                        setDragActive(true);
                        break;

                    case "dragleave":
                        setDragActive(false);
                        break;
                }
            },
            [],
        );

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleChange}
            />

            <div
                role="button"
                tabIndex={
                    disabled
                        ? -1
                        : 0
                }
                onClick={openPicker}
                onKeyDown={(
                    event,
                ) => {
                    if (
                        event.key ===
                        "Enter" ||
                        event.key ===
                        " "
                    ) {
                        event.preventDefault();
                        openPicker();
                    }
                }}
                onDragEnter={
                    handleDrag
                }
                onDragOver={
                    handleDrag
                }
                onDragLeave={
                    handleDrag
                }
                onDrop={
                    handleDrop
                }
                className={`
                    border
                    border-dashed
                    transition-all
                    cursor-pointer
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                    bg-white
                    hover:bg-slate-50
                    ${
                    styles.dropzone
                }
                    ${
                    dragActive
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300"
                }
                    ${
                    disabled
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                }
                `}
            >
                <Upload
                    className={`${styles.icon} text-gray-400`}
                />

                <p className="mt-3 text-xs font-semibold text-gray-700">
                    {title}
                </p>

                {description && (
                    <p className="mt-1 text-[11px] text-gray-400">
                        {description}
                    </p>
                )}
            </div>
        </>
    );
}
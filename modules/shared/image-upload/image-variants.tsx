import { ImageUploadVariant } from "./image-type";

interface ImageVariantConfig {
    preview: string;

    dropzone: string;

    overlay: string;

    icon: string;
}

export const IMAGE_VARIANTS: Record<
    ImageUploadVariant,
    ImageVariantConfig
> = {
    avatar: {
        preview:
            "w-16 h-16 rounded-full",

        dropzone:
            "flex-1 rounded-xl p-4",

        overlay:
            "rounded-full",

        icon:
            "w-5 h-5",
    },

    logo: {
        preview:
            "w-20 h-20 rounded-xl",

        dropzone:
            "flex-1 rounded-xl p-4",

        overlay:
            "rounded-xl",

        icon:
            "w-5 h-5",
    },

    banner: {
        preview:
            "w-full h-40 rounded-2xl",

        dropzone:
            "w-full h-40 rounded-2xl",

        overlay:
            "rounded-2xl",

        icon:
            "w-8 h-8",
    },
};
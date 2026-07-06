const MAX_FILE_SIZE =
    10 * 1024 * 1024;

const ALLOWED_TYPES = [
    "application/pdf",

    "image/jpeg",
    "image/png",
    "image/webp",
];

export function validateDocument(
    file: File,
) {
    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(
            "Only PDF, JPG, PNG and WEBP documents are allowed.",
        );
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error(
            "Document size must not exceed 10 MB.",
        );
    }
}
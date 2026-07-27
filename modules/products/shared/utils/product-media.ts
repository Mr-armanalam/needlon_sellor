export function isImage(
    mimeType: string,
) {
    return mimeType.startsWith("image/");
}

export function isVideo(
    mimeType: string,
) {
    return mimeType.startsWith("video/");
}
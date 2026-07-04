export function getStoragePath(
    publicUrl: string,
    bucket: string,
) {
    const marker = `/storage/v1/object/public/${bucket}/`;

    const index = publicUrl.indexOf(marker);

    if (index === -1) {
        return null;
    }

    return publicUrl.slice(index + marker.length);
}
export function extractStoragePath(
    publicUrl: string,
    bucket: string,
) {
    const marker = `/storage/v1/object/public/${bucket}/`;

    const index = publicUrl.indexOf(marker);

    if (index === -1) {
        throw new Error("Invalid storage url.");
    }

    return publicUrl.substring(
        index + marker.length,
    );
}
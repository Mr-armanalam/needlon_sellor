export function extractPStoragePath(
    publicUrl: string,
) {
    const marker =
        "/object/";

    const index =
        publicUrl.indexOf(marker);

    if (index === -1) {
        throw new Error(
            "Invalid storage url.",
        );
    }

    return publicUrl
        .substring(index + marker.length)
        .split("/")
        .slice(2)
        .join("/");
}
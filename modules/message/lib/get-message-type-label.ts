export function getMessageTypeLabel(
    messageType: string,
): string {
    switch (
        messageType
        ) {
        case "PRODUCT":
            return "Shared a product";

        case "ORDER":
            return "Shared an order";

        case "IMAGE":
            return "Sent an image";

        case "FILE":
            return "Sent an attachment";

        default:
            return "New message";
    }
}
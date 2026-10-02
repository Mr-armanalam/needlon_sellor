export function calculateDiscountPercentage(
    price: number,
    compareAtPrice?: number,
) {

    if (
        !compareAtPrice ||
        compareAtPrice <= price
    ) {
        return 0;
    }

    return Math.round(
        ((compareAtPrice - price) /
            compareAtPrice) *
        100,
    );
}

export function hasDiscount(
    price: number,
    compareAtPrice?: number,
) {
    return (
        calculateDiscountPercentage(
            price,
            compareAtPrice,
        ) > 0
    );
}
import {getProductCategories} from "@/modules/products/repository";

export async function getCategoriesService() {
    const categories = await getProductCategories();

    if (!categories) {
        throw new Error(`Categories not found.`);
    }

    return categories;
}

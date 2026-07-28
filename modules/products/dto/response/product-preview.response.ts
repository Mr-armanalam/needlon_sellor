export interface ProductPreviewResponse {
    id: string;

    title: string;

    slug: string;

    thumbnail: string | null;

    price: number | null;

    status: string;
}
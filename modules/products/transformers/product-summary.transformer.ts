import type {
    ProductSummaryDto,
} from "../dto";

export class ProductSummaryTransformer {
    static toDto(
        data: {
            totalProducts: number;

            activeProducts: number;

            draftProducts: number;

            archivedProducts: number;
        },
    ): ProductSummaryDto {
        return {
            totalProducts:
            data.totalProducts,

            activeProducts:
            data.activeProducts,

            draftProducts:
            data.draftProducts,

            archivedProducts:
            data.archivedProducts,
        };
    }
}
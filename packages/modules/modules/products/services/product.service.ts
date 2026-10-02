// import { injectable, inject } from "tsyringe";
//
// import { randomUUID } from "crypto";
//
// import {
//     ProductRepository,
// } from "../repositories/product.repository";
//
// import {
//     ProductStatus,
// } from "@/db/schema/catalog/products/enums";
//
// @injectable()
// export class ProductService {
//
//     constructor(
//         @inject(ProductRepository)
//         private readonly repository: ProductRepository,
//     ) {}
//
//     async createDraft(
//         sellerId: string,
//         storeId: string,
//     ) {
//
//         const now = new Date();
//
//         const slug =
//             `draft-${Date.now()}`;
//
//         return this.repository.createDraft({
//
//             id: randomUUID(),
//
//             storeId,
//
//             sellerId,
//
//             categoryId: "",
//
//             name: "Untitled Product",
//
//             slug,
//
//             sku: slug,
//
//             status: ProductStatus.DRAFT,
//
//             createdAt: now,
//
//             updatedAt: now,
//
//             createdBy: sellerId,
//
//             updatedBy: sellerId,
//
//         });
//
//     }
//
// }
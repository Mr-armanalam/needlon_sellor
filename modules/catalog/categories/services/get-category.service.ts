// import { NotFoundError } from "@/modules/shared/errors";
//
// import {
//     findCategoryById,
// } from "../repository";
//
// import {
//     toCategoryDto,
// } from "../mapper";
//
// export async function getCategoryService(
//     id: string,
// ) {
//     const category =
//         await findCategoryById(id);
//
//     if (!category) {
//         throw new NotFoundError(
//             "Category not found.",
//         );
//     }
//
//     return toCategoryDto(category);
// }
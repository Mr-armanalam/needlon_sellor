// export async function createCategoryService(
//     data: CreateCategoryInput,
// ) {
//     const slug =
//         await generateUniqueCategorySlug(
//             data.name,
//         );
//
//     const category =
//         await createCategory({
//             ...data,
//             slug,
//         });
//
//     return toCategoryDto(category);
// }
// interface GenerateUniqueSlugOptions {
//     value: string;
//
//     exists: (
//         slug: string,
//     ) => Promise<boolean>;
// }
//
// const slug =
//     await generateUniqueSlug({
//
//         value: category.name,
//
//         exists: async (slug) =>
//             Boolean(
//                 await findCategoryBySlug(slug),
//             ),
//
//     });
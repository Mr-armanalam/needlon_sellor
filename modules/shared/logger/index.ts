export * from "./logger";
export * from "./types";


//Update your errorResponse()
//
// Instead of
//
// console.error(error);
//
// use
//
// import { logger } from "../logger";
//
// and
//
// logger.error(
//     "Unhandled server exception",
//     error,
//     {
//         module: "API",
//         action: "RouteHandler",
//     },
// );
// Example Repository
//
// Instead of
//
// console.log(product);
//
// use
//
// logger.debug(
//     "Product loaded",
//     {
//         module: "ProductRepository",
//         productId: product.id,
//     },
// );
// Example Service
// logger.info(
//     "Product created",
//     {
//         module: "ProductService",
//         sellerId,
//         productId,
//     },
// );
// Example Controller
// logger.warn(
//     "Unauthorized product update attempt",
//     {
//         module: "ProductController",
//         sellerId,
//         productId,
//     },
// );
// Example Error
// try {
//     ...
// } catch (error) {
//     logger.error(
//         "Failed to create product",
//         error,
//         {
//             module: "ProductService",
//             sellerId,
//         },
//     );
//
//     throw error;
// }
// "use server";

// import { db } from "@/db";
// import { productItems } from "@/db/schema/product-items";
// import { usersTable } from "@/db/schema/users";
// import { wishListItems } from "@/db/schema/wishlist-items";
// import { eq } from "drizzle-orm";

// export const getAllWishlistItems = async (userId: string) => {
//   try {
//     if (!userId)
//       return { message: "please login to add wishlist", data: [], status: 400 };

//     const items = await db
//       .select()
//       .from(wishListItems)
//       .innerJoin(productItems, eq(wishListItems.productId, productItems.id))
//       .where(eq(wishListItems.userId, userId));

//     if (items.length === 0)
//       return { message: "wishlist is empty", data: [], status: 200 };

//     const transformedData = items.map((item) => ({
//       wishlist_id: item.wishlist_items.id,
//       productid: item.product_items.id,
//       name: item.product_items.name,
//       price: item.product_items.price,
//       quantity: item.wishlist_items.quantity, // from wishlist_items
//       size: item.wishlist_items.size, // wishlist size, not product_items.sizes
//       image: item.product_items.image,
//     }));

//     return { message: "success", data: transformedData, status: 200 };
//   } catch (error) {
//     console.log(error);
//     return { message: error, data: [], status: 500 };
//   }
// };

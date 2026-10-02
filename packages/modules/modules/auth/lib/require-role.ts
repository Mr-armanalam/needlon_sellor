// import { redirect } from "next/navigation";
// import { requireSeller } from "./require-seller";

// export async function requireRole(
//   roles: string[]
// ) {
//   const seller =
//     await requireSeller();

//   if (
//     !roles.includes(seller.role)
//   ) {
//     redirect("/dashboard");
//   }

//   return seller;
// }
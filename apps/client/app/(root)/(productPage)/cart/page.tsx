// import CartView from '@/modules/cart/view/cart-view'
// import React from 'react'

// const page = () => {
//   return (
//     <div className='lg:px-20 bg-zinc-100 h-[100vh]'>
//       <CartView />
//     </div>
//   )
// }

// export default page

import { auth } from "@/auth";
import { fetchCartSSR } from "@/modules/cart/server/cart-fetching";
import CartView from "@/modules/cart/view/cart-view";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  const cart = await fetchCartSSR(userId);

  return (
    <div className="lg:px-20 bg-zinc-100 dark:bg-black min-h-screen">
      <CartView cart={cart} userId={userId} />
    </div>
  );
}

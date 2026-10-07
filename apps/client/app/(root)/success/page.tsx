/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { getOrderFromDB } from "@/modules/webhook/server/get-orderfrmdb";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }>}) {
  const {session_id: sessionId} = await searchParams;
  if (!sessionId) redirect("/");

  const {line_items, Payment} = await getOrderFromDB(sessionId ?? ''); 
  if (!(line_items && Payment )) redirect("/");  
  
  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold">
        {Payment.status === 'paid' ? "✅ Payment Successful!" : "❌ Payment Failed!"}
      </h1>
      <p className="text-gray-600">{Payment.status === 'paid' ? "Thank you for your purchase." : "Your payment could not be processed."}</p>

      {Payment.status === 'paid' && (
         <div className="mt-8 text-start bg-stone-50 shadow px-8 py-4 rounded-md max-w-lg mx-auto">
         <div className="flex items-cente justify-between">
          <h2 className="text-2xl font-garamond font-bold mt-4">Order Summary</h2>
         <p className="text-sm font-bold text-stone-600">{Payment.status === 'paid' ? 'Order Placed!' : 'Payment Failed'}</p>
        </div>

         <p className="text-sm mt-4 text-yellow-800">
           <strong className="text-gray-700">Order ID:</strong> {Payment?.orderId}
         </p>
         <p className="text-sm mt-2 text-yellow-800">
           <strong className="text-gray-700">Amount Paid:</strong> ₹{(Payment.paymentAmount || 0)}
         </p>

         <ul className="text-left text-gray-600 list-disc ml-4 text-sm mt-2">
           {line_items.data.map((item: any, idx: number) => (
             <li key={idx} className="font-semibold">
               {item.quantity} × {item.description}
             </li>
           ))}
         </ul>
       </div>
      )}
    </div>
  );
}



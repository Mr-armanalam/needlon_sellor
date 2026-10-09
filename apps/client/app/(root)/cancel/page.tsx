"use client";
import { useRouter } from "next/navigation";
export default function CancelPage() {
  const router = useRouter();
  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold">✅ Your Payment Cancelled!</h1>
      <p>
        Let&apos;s purchase again.{" "}
        <span
          onClick={() => router.push("/cart")}
          className="underline cursor-pointer text-blue-700"
        >
          Go-to-cart
        </span>
      </p>
    </div>
  );
}

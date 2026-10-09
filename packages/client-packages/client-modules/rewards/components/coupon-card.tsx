"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { CopyIcon, EyeIcon, ReceiptIndianRupee } from "lucide-react";
import { Rewards } from "@/app/(root)/(account)/account/rewards/page";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export function CouponCard({ coupon }: { coupon: Rewards }) {
  const [isCouponVisible, setIsCouponVisible] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const couponRef = useRef<HTMLDivElement | null>(null);

  const handleCopyClick = async () => {
    const textToCopy =
      coupon.coupon_code ?? couponRef.current?.textContent ?? "";

    if (!textToCopy) {
      setCopySuccess("Nothing to copy!");
      setTimeout(() => setCopySuccess(""), 2000);
      return;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      setCopySuccess("Failed to copy!");
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-2xl shadow-xl border bg-white/5 backdrop-blur-sm transition transform hover:scale-[1.02] hover:shadow-2xl",
        `bg-gradient-to-br ${coupon.gradient ?? "from-blue-500 to-cyan-500"}`
      )}
    >
      <CardContent className="relative p-6 text-white">
        <div className="flex flex-col gap-3">
          <div className="text-3xl font-extrabold tracking-wide drop-shadow-lg">
            {coupon.discount}
          </div>

          <div className="text-base opacity-90">{coupon.discription}</div>

          <div
            ref={couponRef}
            className={cn(
              "mt-3 w-fit px-4 flex items-center justify-center py-2 rounded-xl border backdrop-blur text-sm font-semibold tracking-wider bg-white/20 border-white/40"
            )}
          >
            <p className="mr-2">
              {isCouponVisible ? coupon.coupon_code : "*****"}{" "}
            </p>
            {isCouponVisible ? (
              copySuccess === "" && (
                <CopyIcon
                  className="cursor-pointer"
                  onClick={handleCopyClick}
                  size={17}
                />
              )
            ) : (
              <EyeIcon
                className="cursor-pointer"
                onClick={() => setIsCouponVisible(true)}
                size={17}
              />
            )}
            {copySuccess !== "" && copySuccess}
          </div>

          <div className="text-xs mt-2 opacity-90">
            Valid: {formatDate(String(coupon.validFrom))} –{" "}
            {formatDate(String(coupon.validTo))}
          </div>

          <div className="mt-3 text-xs font-bold uppercase tracking-wide">
            {coupon.status === "active" && (
              <span className="px-3 py-1 bg-green-500/30 border border-green-400/40 rounded-full text-green-200">
                ACTIVE
              </span>
            )}

            {coupon.status === "upcoming" && (
              <span className="px-3 py-1 bg-yellow-500/30 border border-yellow-400/40 rounded-full text-yellow-200">
                UPCOMING
              </span>
            )}

            {coupon.status === "expired" && (
              <span className="px-3 py-1 bg-red-500/30 border border-red-400/40 rounded-full text-red-200">
                EXPIRED
              </span>
            )}
          </div>

          <Button
            disabled={coupon.status !== "active"}
            className={cn(
              "mt-4 w-full font-bold cursor-pointer rounded-xl text-sm py-3",
              coupon.status === "active"
                ? "bg-white text-gray-900 hover:bg-gray-200"
                : "bg-white/30 text-white/60 cursor-not-allowed"
            )}
            onClick={() => setIsCouponVisible(true)}
          >
            <ReceiptIndianRupee size={10} />
            {coupon.title}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { actions } from "../data/quickActionData";
import ActionGridComp from "../components/action-grid-component";

interface QuickActionsProps {
  storeSlug?: string;
}

export default function QuickActions({ storeSlug }: QuickActionsProps) {
  const router = useRouter();

  const handleActionClick = async (title: string) => {
    switch (title) {
      case "Add Product":
        router.push("/products");
        break;
      case "Share Shop": {
        const url = typeof window !== "undefined"
          ? `${window.location.origin}/shop/${storeSlug || "store"}`
          : "";
        if (navigator?.share) {
          try {
            await navigator.share({
              title: "My Shop on Needlon",
              url,
            });
            toast.success("Store link shared!");
            return;
          } catch {
            // fallback to clipboard
          }
        }
        if (navigator?.clipboard) {
          await navigator.clipboard.writeText(url);
          toast.success("Store link copied to clipboard!");
        } else {
          toast.success(`Store link: ${url}`);
        }
        break;
      }
      case "View Orders":
        router.push("/orders");
        break;
      case "Withdraw Earnings":
        router.push("/earnings");
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Label Section */}
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-neutral-400 tracking-tight uppercase">
          Quick Actions
        </h3>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          return (
            <ActionGridComp
              key={index}
              action={action}
              onClick={() => handleActionClick(action.title)}
            />
          );
        })}
      </div>
    </div>
  );
}


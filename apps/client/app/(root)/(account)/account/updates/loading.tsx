
import { Skeleton } from "@/components/ui/skeleton";
import { Bell } from "lucide-react";

export default function NotificationSkeleton() {
  return (
    <div className="w-full px-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
         <div className="flex items-center gap-2 mb-4">
        <Bell size={22} className="text-gray-700" />
        <h1 className="text-xl font-bold font-garamond text-gray-800">
          Notifications
        </h1>
      </div>

        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-full border-b p-5 bg-muted/20 rounded-xl flex gap-4 items-start"
          >
            {/* Icon */}
            <Skeleton className="h-10 w-10 rounded-full" />

            {/* Text block */}
            <div className="flex-1">
              <Skeleton className="h-4 w-44 mb-2" />
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-20" />
            </div>

            {/* Unread dot */}
            <Skeleton className="h-3 w-3 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

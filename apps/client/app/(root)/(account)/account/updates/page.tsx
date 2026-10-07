import NotificationView from "@/modules/notification/view/notification-view";
import { cookies } from "next/headers";

export default async function Page() {
  const cookie = await cookies();
  const cookieStore = cookie.toString();

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/notification`, {
    cache: "no-store",
    headers: {
      Cookie: cookieStore
    }
  });

  if (!res.ok) return null;
  const notificationsData = await res.json();
  const notifications = notificationsData.notification;

  return <NotificationView initialData={notifications} />;
}

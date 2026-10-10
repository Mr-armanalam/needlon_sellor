import NotificationView from "@/modules/notification/view/notification-view";
import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/lib/get-api-url";

export default async function Page() {
  const cookie = await cookies();
  const cookieStore = cookie.toString();
  let notifications: any[] = [];

  try {
    const baseUrl = await getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/notification`, {
      cache: "no-store",
      headers: {
        Cookie: cookieStore,
      },
    });

    if (res.ok) {
      const notificationsData = await res.json();
      if (notificationsData?.notification) {
        notifications = notificationsData.notification;
      }
    }
  } catch (error) {
    console.warn("Updates page fetch error:", (error as Error).message);
  }

  return <NotificationView initialData={notifications} />;
}

import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import {
  getSellerNotificationsRepo,
  markNotificationAsReadRepo,
  getNotificationPreferencesRepo,
  updateNotificationPreferencesRepo,
} from "../repository/notification.repository";
import { MarkNotificationReadDto, UpdateNotificationPreferencesDto } from "../dto/notification.dto";

export async function getSellerNotificationsService() {
  const seller = await getCurrentSeller();
  const notifications = await getSellerNotificationsRepo(seller.id);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
  };
}

export async function markNotificationReadService(dto: MarkNotificationReadDto) {
  const seller = await getCurrentSeller();
  await markNotificationAsReadRepo(seller.id, dto.notificationId, dto.markAll);
  return { success: true };
}

export async function getNotificationPreferencesService() {
  const seller = await getCurrentSeller();
  return getNotificationPreferencesRepo(seller.id);
}

export async function updateNotificationPreferencesService(dto: UpdateNotificationPreferencesDto) {
  const seller = await getCurrentSeller();
  return updateNotificationPreferencesRepo(seller.id, dto);
}

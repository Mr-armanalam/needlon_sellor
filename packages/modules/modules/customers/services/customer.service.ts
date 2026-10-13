import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import {
  getSellerCustomersData,
  getCustomerDetailsRepo,
  createOrLinkWalkInCustomerRepo,
  createInStoreMeasurementRepo,
  createInStoreOrderRepo,
  updateTailoringStageRepo,
  getChatPermissionRepo,
  requestChatPermissionRepo,
  respondChatPermissionRepo,
  toggleChatPermissionRepo,
  allowCustomerMeasurementEditRepo,
} from "../repository/customer.repository";
import type { CreateWalkInCustomerDto } from "../dto/walk-in-customer.dto";
import type { RecordInStoreMeasurementDto } from "../dto/in-store-measurement.dto";
import type { CreateInStoreOrderDto, UpdateTailoringStageDto } from "../dto/create-in-store-order.dto";

export async function getSellerCustomersService(search?: string) {
  const seller = await getCurrentSellerOrThrow();
  return getSellerCustomersData(seller.id, search);
}

export async function getSellerCustomerDetailsService(buyerId: string) {
  const seller = await getCurrentSellerOrThrow();
  return getCustomerDetailsRepo(seller.id, buyerId);
}

export async function createWalkInCustomerService(data: CreateWalkInCustomerDto) {
  const seller = await getCurrentSellerOrThrow();
  return createOrLinkWalkInCustomerRepo(seller.id, data);
}

export async function recordInStoreMeasurementService(data: RecordInStoreMeasurementDto) {
  const seller = await getCurrentSellerOrThrow();
  return createInStoreMeasurementRepo(seller.id, data);
}

export async function createInStoreOrderService(data: CreateInStoreOrderDto) {
  const seller = await getCurrentSellerOrThrow();
  return createInStoreOrderRepo(seller.id, data);
}

export async function updateTailoringStageService(orderId: string, data: UpdateTailoringStageDto) {
  const seller = await getCurrentSellerOrThrow();
  return updateTailoringStageRepo(seller.id, orderId, data);
}

export async function getChatPermissionService(buyerId: string) {
  const seller = await getCurrentSellerOrThrow();
  return getChatPermissionRepo(seller.id, buyerId);
}

export async function requestChatPermissionService(buyerId: string, message?: string) {
  const seller = await getCurrentSellerOrThrow();
  return requestChatPermissionRepo(seller.id, buyerId, message);
}

export async function respondChatPermissionService(buyerId: string, sellerId: string, status: "ACCEPTED" | "DECLINED") {
  return respondChatPermissionRepo(buyerId, sellerId, status);
}

export async function toggleChatPermissionService(buyerId: string, sellerId: string, isEnabled: boolean) {
  return toggleChatPermissionRepo(buyerId, sellerId, isEnabled);
}

export async function allowCustomerMeasurementEditService(measurementId: string) {
  const seller = await getCurrentSellerOrThrow();
  return allowCustomerMeasurementEditRepo(seller.id, measurementId);
}



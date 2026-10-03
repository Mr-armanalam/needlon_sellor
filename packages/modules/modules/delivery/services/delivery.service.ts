import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import {
  getShippingPartners,
  getShippingMethodsForPartner,
  updateShippingPartnerRepo,
  getDeliverySettingsRepo,
  updateLocalDeliverySettingsRepo,
  updatePickupHubRepo,
  addShippingZoneRepo,
  createShipmentOrder,
  getSellerShipments,
  updateShipmentStatus,
} from "../repository/delivery.repository";
import {
  CreateShipmentOrderDto,
  UpdateShipmentStatusDto,
  ConnectCarrierDto,
  LocalDeliverySettingsDto,
  PickupHubDto,
  ShippingZoneDto,
} from "../dto/delivery.dto";

export async function getShippingPartnersService() {
  const partners = await getShippingPartners();
  const partnersWithMethods = await Promise.all(
    partners.map(async (p) => {
      const methods = await getShippingMethodsForPartner(p.id);
      return {
        ...p,
        methods,
      };
    })
  );
  return partnersWithMethods;
}

export async function connectCarrierService(dto: ConnectCarrierDto) {
  await getCurrentSellerOrThrow();
  return updateShippingPartnerRepo(dto);
}

export async function getDeliverySettingsService() {
  await getCurrentSellerOrThrow();
  return getDeliverySettingsRepo();
}

export async function updateLocalDeliverySettingsService(dto: LocalDeliverySettingsDto) {
  await getCurrentSellerOrThrow();
  return updateLocalDeliverySettingsRepo(dto);
}

export async function updatePickupHubService(dto: PickupHubDto) {
  await getCurrentSellerOrThrow();
  return updatePickupHubRepo(dto);
}

export async function addShippingZoneService(dto: ShippingZoneDto) {
  await getCurrentSellerOrThrow();
  return addShippingZoneRepo(dto);
}

export async function getSellerShipmentsService(statusFilter?: string) {
  const seller = await getCurrentSellerOrThrow();
  return getSellerShipments(seller.id, statusFilter);
}

export async function createShipmentOrderService(dto: CreateShipmentOrderDto) {
  const seller = await getCurrentSellerOrThrow();
  return createShipmentOrder(seller.id, dto);
}

export async function updateShipmentStatusService(dto: UpdateShipmentStatusDto) {
  await getCurrentSellerOrThrow();
  return updateShipmentStatus(dto);
}

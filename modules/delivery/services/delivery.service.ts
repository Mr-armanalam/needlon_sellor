import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import {
  getShippingPartners,
  getShippingMethodsForPartner,
  createShipmentOrder,
  getSellerShipments,
  updateShipmentStatus,
} from "../repository/delivery.repository";
import { CreateShipmentOrderDto, UpdateShipmentStatusDto } from "../dto/delivery.dto";

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

export async function getSellerShipmentsService(statusFilter?: string) {
  const seller = await getCurrentSeller();
  return getSellerShipments(seller.id, statusFilter);
}

export async function createShipmentOrderService(dto: CreateShipmentOrderDto) {
  const seller = await getCurrentSeller();
  return createShipmentOrder(seller.id, dto);
}

export async function updateShipmentStatusService(dto: UpdateShipmentStatusDto) {
  await getCurrentSeller();
  return updateShipmentStatus(dto);
}

export interface UpdateDeliveryDto {
  pickupHubAddress?: string;
  packageWeight?: string | number;
  deliveryRadiusRange?: string;
  estimatedDeliveryWindow?: string;
}

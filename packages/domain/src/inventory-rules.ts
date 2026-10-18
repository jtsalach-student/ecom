export interface StockReservationPolicy {
  standardExpiryMinutes: number;
  mobileMoneyHoldMinutes: number;
}

export const DEFAULT_RESERVATION_POLICY: StockReservationPolicy = {
  standardExpiryMinutes: 15,
  mobileMoneyHoldMinutes: 30,
};

export function isReservationExpired(reservationExpiresAt: Date | string): boolean {
  const expiryTime = new Date(reservationExpiresAt).getTime();
  return Date.now() > expiryTime;
}

export function computeReservationExpiry(
  isMobileMoney = false,
  policy: StockReservationPolicy = DEFAULT_RESERVATION_POLICY
): Date {
  const minutes = isMobileMoney ? policy.mobileMoneyHoldMinutes : policy.standardExpiryMinutes;
  return new Date(Date.now() + minutes * 60 * 1000);
}

export function validateStockAvailability(
  quantityOnHand: number,
  quantityReserved: number,
  requestedQuantity: number
): { available: boolean; quantityAvailable: number; deficit: number } {
  const quantityAvailable = Math.max(0, quantityOnHand - quantityReserved);
  const available = quantityAvailable >= requestedQuantity;
  const deficit = available ? 0 : requestedQuantity - quantityAvailable;

  return {
    available,
    quantityAvailable,
    deficit,
  };
}

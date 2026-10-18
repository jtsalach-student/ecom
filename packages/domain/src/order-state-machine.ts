import { OrderStatus } from "@gcp/contracts";

export class DomainTransitionError extends Error {
  constructor(public fromStatus: OrderStatus, public toStatus: OrderStatus, public reason?: string) {
    super(`Illegal order status transition from ${fromStatus} to ${toStatus}${reason ? `: ${reason}` : ""}`);
    this.name = "DomainTransitionError";
  }
}

export const VALID_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  DRAFT: ["PENDING_PAYMENT", "CANCELLED"],
  PENDING_PAYMENT: ["PAYMENT_PROCESSING", "PAID", "CANCELLED"],
  PAYMENT_PROCESSING: ["PAID", "PENDING_PAYMENT", "CANCELLED"],
  PAID: ["AWAITING_FULFILMENT", "REFUNDED", "CANCELLED"],
  AWAITING_FULFILMENT: ["PARTIALLY_FULFILLED", "SHIPPED", "READY_FOR_PICKUP", "REFUNDED", "CANCELLED"],
  PARTIALLY_FULFILLED: ["SHIPPED", "READY_FOR_PICKUP", "DELIVERED", "REFUNDED"],
  SHIPPED: ["DELIVERED", "COMPLETED", "REFUNDED"],
  READY_FOR_PICKUP: ["DELIVERED", "COMPLETED", "REFUNDED"],
  DELIVERED: ["COMPLETED", "REFUNDED", "PARTIALLY_REFUNDED"],
  COMPLETED: ["REFUNDED", "PARTIALLY_REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
  PARTIALLY_REFUNDED: ["REFUNDED"],
};

export function canTransitionOrder(fromStatus: OrderStatus, toStatus: OrderStatus): boolean {
  if (fromStatus === toStatus) return true;
  const allowed = VALID_ORDER_TRANSITIONS[fromStatus];
  return allowed ? allowed.includes(toStatus) : false;
}

export function validateOrderTransition(fromStatus: OrderStatus, toStatus: OrderStatus): void {
  if (!canTransitionOrder(fromStatus, toStatus)) {
    throw new DomainTransitionError(fromStatus, toStatus);
  }
}

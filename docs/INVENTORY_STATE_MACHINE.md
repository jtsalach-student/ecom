# Inventory & Concurrency Management Architecture

## 1. Inventory State Machine
The inventory engine tracks hardware units through a strict transactional ledger:

```mermaid
stateDiagram-v2
    [*] --> InStock: PO Goods Received
    InStock --> Reserved: Order Checkout Initiated (15m Lock)
    Reserved --> InStock: Reservation Timeout / Cancellation
    Reserved --> Sold: Payment Verified (Webhook charge.success)
    InStock --> Defective: RMA / Inspection Failure
    Defective --> InRepair: Technician Job Card Created
    InRepair --> InStock: Repaired & Tested
    Sold --> InStock: Customer Return & Restocking
```

---

## 2. Preventing Overselling (ACID Concurrency)
- When a customer proceeds to checkout, `reserveStock(tenantId, branchId, variantId, qty, orderId)` is invoked.
- Available stock is evaluated as:
  $$\text{quantityAvailable} = \text{quantityOnHand} - \text{quantityReserved}$$
- If $\text{quantityAvailable} < \text{requestedQuantity}$, the request is rejected with HTTP 409 and available stock count.
- Once Paystack confirms payment, `commitStockDeduction` atomically decrements both `quantityOnHand` and `quantityReserved`, preserving consistency.
- Serial numbers / IMEIs are tracked individually to prevent duplicates.

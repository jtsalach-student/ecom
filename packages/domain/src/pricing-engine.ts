export interface PriceCalculationInput {
  items: Array<{
    unitPrice: number;
    quantity: number;
    discountPercent?: number;
    fixedDiscount?: number;
  }>;
  couponDiscountAmount?: number;
  taxRatePercent?: number; // e.g. 15 for standard VAT or 0 if prices are VAT-inclusive
  deliveryMethod: "STANDARD_DELIVERY" | "EXPRESS_SAME_DAY" | "BRANCH_PICKUP";
  deliveryZoneRate?: number;
}

export interface PriceCalculationResult {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  deliveryFee: number;
  grandTotal: number;
  itemBreakdown: Array<{
    unitPrice: number;
    quantity: number;
    discountAmount: number;
    total: number;
  }>;
}

export function calculateOrderPricing(input: PriceCalculationInput): PriceCalculationResult {
  let subtotal = 0;
  let itemDiscounts = 0;

  const itemBreakdown = input.items.map((item) => {
    const rawItemTotal = item.unitPrice * item.quantity;
    let itemDiscount = 0;

    if (item.discountPercent && item.discountPercent > 0) {
      itemDiscount += (rawItemTotal * item.discountPercent) / 100;
    }
    if (item.fixedDiscount && item.fixedDiscount > 0) {
      itemDiscount += item.fixedDiscount * item.quantity;
    }

    itemDiscount = Math.min(itemDiscount, rawItemTotal);
    const itemNetTotal = rawItemTotal - itemDiscount;

    subtotal += rawItemTotal;
    itemDiscounts += itemDiscount;

    return {
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      discountAmount: Math.round(itemDiscount * 100) / 100,
      total: Math.round(itemNetTotal * 100) / 100,
    };
  });

  const totalDiscount = Math.min(
    subtotal,
    itemDiscounts + (input.couponDiscountAmount || 0)
  );

  const taxableBase = Math.max(0, subtotal - totalDiscount);
  const taxRate = input.taxRatePercent ? input.taxRatePercent / 100 : 0;
  const taxTotal = Math.round(taxableBase * taxRate * 100) / 100;

  let deliveryFee = 0;
  if (input.deliveryMethod === "BRANCH_PICKUP") {
    deliveryFee = 0;
  } else if (input.deliveryMethod === "EXPRESS_SAME_DAY") {
    deliveryFee = (input.deliveryZoneRate || 50) * 1.5;
  } else {
    deliveryFee = input.deliveryZoneRate || 35;
  }

  const grandTotal = Math.max(0, Math.round((taxableBase + taxTotal + deliveryFee) * 100) / 100);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountTotal: Math.round(totalDiscount * 100) / 100,
    taxTotal,
    deliveryFee: Math.round(deliveryFee * 100) / 100,
    grandTotal,
    itemBreakdown,
  };
}

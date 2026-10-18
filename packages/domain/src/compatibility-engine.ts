import { ProductListing, ProductCompatibility } from "@gcp/contracts";

export function findCompatibleAccessories(
  product: ProductListing,
  allCompatibilities: ProductCompatibility[],
  allProducts: ProductListing[]
): Array<{ compatibility: ProductCompatibility; accessory: ProductListing }> {
  const matchingRules = allCompatibilities.filter(
    (c) => c.primaryProductId === product.id
  );

  const productMap = new Map<string, ProductListing>(
    allProducts.map((p) => [p.id, p])
  );

  const results: Array<{ compatibility: ProductCompatibility; accessory: ProductListing }> = [];

  for (const rule of matchingRules) {
    const accessory = productMap.get(rule.compatibleProductId);
    if (accessory && accessory.isPublished) {
      results.push({ compatibility: rule, accessory });
    }
  }

  return results;
}

export function isAccessoryCompatible(
  primaryProduct: ProductListing,
  accessory: ProductListing,
  compatibilities: ProductCompatibility[]
): boolean {
  return compatibilities.some(
    (c) =>
      c.primaryProductId === primaryProduct.id &&
      c.compatibleProductId === accessory.id
  );
}

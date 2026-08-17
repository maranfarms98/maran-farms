/**
 * Re-fetch authoritative product prices/stock and build order line items.
 * Never trust client-submitted totals.
 *
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {{ productId: string, quantity: number }[]} items
 * @returns {Promise<{ orderItems: object[], total: number } | { error: string, status: number }>}
 */
export async function buildOrderItems(supabase, items) {
  if (!Array.isArray(items) || items.length === 0) {
    return { error: "Cart items are required", status: 400 };
  }

  for (const item of items) {
    if (!item?.productId || !Number.isFinite(Number(item.quantity)) || Number(item.quantity) < 1) {
      return { error: "Each item needs a productId and quantity ≥ 1", status: 400 };
    }
  }

  const productIds = [...new Set(items.map((i) => i.productId))];
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price, unit, image, track_inventory, stock_qty")
    .in("id", productIds);

  if (productsError) {
    console.error("[buildOrderItems] products fetch", productsError);
    return { error: "Failed to verify cart", status: 500 };
  }

  const productMap = new Map((products || []).map((p) => [p.id, p]));
  const orderItems = [];
  let total = 0;

  // Aggregate quantities if the same product appears twice.
  const qtyByProduct = new Map();
  for (const item of items) {
    const qty = Math.floor(Number(item.quantity));
    qtyByProduct.set(item.productId, (qtyByProduct.get(item.productId) || 0) + qty);
  }

  for (const [productId, quantity] of qtyByProduct) {
    const product = productMap.get(productId);
    if (!product) {
      return { error: `Product ${productId} is no longer available`, status: 400 };
    }
    if (product.track_inventory && product.stock_qty < quantity) {
      return { error: `${product.name} is out of stock`, status: 400 };
    }
    const lineTotal = Number(product.price) * quantity;
    total += lineTotal;
    orderItems.push({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      unit: product.unit,
      image: product.image || null,
      quantity,
      lineTotal,
    });
  }

  if (total <= 0) {
    return { error: "Invalid order total", status: 400 };
  }

  return { orderItems, total };
}

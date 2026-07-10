export function formatPrice(price) {
  if (Number.isInteger(price)) {
    return `₹${price.toLocaleString("en-IN")}`;
  }
  return `₹${price.toLocaleString("en-IN", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}`;
}

export function pluralizeUnit(unit, qty) {
  if (qty === 1) return unit;
  const map = {
    "per stick": "sticks",
    "per plant": "plants",
    each: "units",
    "per pair": "pairs",
    stick: "sticks",
    sticks: "sticks",
    plant: "plants",
    plants: "plants",
    chick: "chicks",
    pair: "pairs",
    rabbit: "rabbits",
    hamster: "hamsters",
  };
  if (map[unit]) return map[unit];
  if (unit.startsWith("per ")) {
    const base = unit.replace("per ", "");
    return base.endsWith("s") ? base : `${base}s`;
  }
  return unit.endsWith("s") ? unit : `${unit}s`;
}

export function formatMinOrder(product) {
  const unit = pluralizeUnit(product.minOrderUnit || "unit", product.minOrder);
  return `Min ${product.minOrder} ${unit}`;
}

const XAF = new Intl.NumberFormat("fr-CM", { style: "currency", currency: "XAF", maximumFractionDigits: 0 });

export function formatXAF(amount) {
  if (amount === null || amount === undefined) return "Enquire to purchase";
  return XAF.format(amount);
}

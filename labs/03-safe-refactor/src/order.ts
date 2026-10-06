export type Line = { sku: string; unitPriceCents: number; quantity: number };
export type OrderResult = { totalCents: number; auditLabel: string };

export function buildOrder(lines: Line[], member: boolean): OrderResult {
  if (!Array.isArray(lines) || lines.length === 0)
    throw new Error("An order needs at least one line");
  let runningTotal = 0;
  for (let i = 0; i < lines.length; i += 1) {
    const current = lines[i];
    if (!current.sku.trim()) throw new Error("Each line needs a SKU");
    if (current.unitPriceCents < 0) throw new Error("Price cannot be negative");
    if (!Number.isInteger(current.quantity) || current.quantity < 1)
      throw new Error("Quantity must be a positive integer");
    runningTotal += current.unitPriceCents * current.quantity;
  }
  if (!Number.isSafeInteger(runningTotal))
    throw new Error("Order total is too large");
  let discount = 0;
  if (member) {
    if (runningTotal > 10000)
      discount = Math.min(1500, Math.floor(runningTotal * 0.1));
    else discount = Math.floor(runningTotal * 0.05);
  }
  const totalCents = runningTotal - discount;
  return {
    totalCents,
    auditLabel: `${lines.length}-line:${member ? "member" : "guest"}:${totalCents}`,
  };
}

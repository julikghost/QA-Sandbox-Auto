/** Same shortening as frontend `tid()` for data-testid suffixes. */
export function toTestId(id: string): string {
  if (!id.includes("-")) return id;
  const last = id.replace(/-/g, "").slice(-12);
  return last.replace(/^0+/, "") || "0";
}

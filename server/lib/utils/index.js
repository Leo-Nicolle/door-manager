export function compareHours(a, b) {
  const compHours = +a.HH - +b.HH;
  const compMins = +a.mm - +b.mm;
  return compHours === 0 ? compMins : compHours;
}

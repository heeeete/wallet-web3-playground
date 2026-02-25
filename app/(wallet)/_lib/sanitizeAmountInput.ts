export function sanitizeAmountInput(raw: string) {
  let v = raw.replace(/[^\d.]/g, '');

  const firstDot = v.indexOf('.');
  if (firstDot !== -1) {
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, '');
  }

  if (v.startsWith('0') && !v.startsWith('0.') && v.length > 1) {
    v = v.replace(/^0+/, '');
    if (v === '') v = '0';
  }

  return v;
}

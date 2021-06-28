/**
 * Requests a URL, returning a promise
 *
 * @param  {string} val       The value to format
 *
 * @return {string}           The response string
 */

let formatter = new Intl.NumberFormat('ru', {
  minimumFractionDigits: 2,
});

let formatter4 = new Intl.NumberFormat('ru', {
  minimumFractionDigits: 4,
});

export default function priceFormatter(val, precision) {
  return precision === 4 ? formatter4.format(val) : formatter.format(val);
}

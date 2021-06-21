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

export default function priceFormatter(val) {
  return formatter.format(val);
}

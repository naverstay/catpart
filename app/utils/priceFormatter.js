/**
 * Requests a URL, returning a promise
 *
 * @param  {string} val       The value to format
 *
 * @return {string}           The response string
 */

export default function priceFormatter(val) {
  return Intl.NumberFormat('ru-RU').format(val);
}

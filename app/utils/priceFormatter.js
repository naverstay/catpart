/**
 * Форматирование цены
 *
 * @param  {string} val       The value to format
 * @param  {number} precision The precision 2 or 4
 *
 * @return {string}           The response string
 */

let formatter = new Intl.NumberFormat('ru', {
  minimumFractionDigits: 3,
});

let formatter4 = new Intl.NumberFormat('ru', {
  minimumFractionDigits: 5,
});

export default function priceFormatter(val, precision) {
  return (precision === 4 ? formatter4.format(val) : formatter.format(val)).replace(/.$/, '');
}

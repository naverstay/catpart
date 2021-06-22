/**
 * Эффект счетчика от начального значения до конечного за заданный промежуток времени
 *
 * @param {array} arr
 * @param {number} val
 *
 * @returns {number}
 */
export const closestIndex = (arr, val) => {
  let ret = 0;
  arr.every((p, pi) => {
    if (pi) {
      if (val >= arr[pi - 1].quant && val < p.quant) {
        ret = pi - 1;
        return false;
      }
    }

    return true;
  });

  if (val >= arr[arr.length - 1].quant) {
    ret = arr.length - 1;
  }

  return ret;
};

/**
 * Эффект счетчика от начального значения до конечного за заданный промежуток времени
 *
 * @param el
 * @param {number} startValue
 * @param {number} endValue
 * @param {number} stepCount
 * @param {number} duration
 *
 * @returns {number}
 */
export const counterEffect = (el, startValue, endValue, stepCount, duration) => {
  let currentValue = startValue;
  let stepValue = (endValue - startValue) / stepCount;

  if (stepValue < 1) {
    stepValue = 1;
  }

  if (Math.abs(stepValue * stepCount) < Math.abs(endValue - startValue)) {
    stepValue = 1;
  }

  let stepTime = Math.abs(Math.floor(duration / (endValue - startValue)));

  if (stepTime === duration) {
    stepTime = 0;
  }

  if (endValue === startValue) {
    el.innerHTML = new Intl.NumberFormat('ru-RU').format(parseInt(endValue));
  } else {
    let timer = setInterval(() => {
      currentValue += stepValue;

      if (stepValue > 0 && currentValue < endValue) {
        el.innerHTML = new Intl.NumberFormat('ru-RU').format(parseInt(currentValue));
      } else if (stepValue < 0 && currentValue > endValue) {
        el.innerHTML = new Intl.NumberFormat('ru-RU').format(parseInt(currentValue));
      } else {
        el.innerHTML = new Intl.NumberFormat('ru-RU').format(parseInt(endValue));

        clearInterval(timer);
      }
    }, stepTime);
  }
};

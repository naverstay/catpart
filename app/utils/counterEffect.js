/**
 * Эффект счетчика от начального значения до конечного за заданный промежуток времени
 *
 * @param el
 * @param {number} startValue
 * @param {number} endValue
 * @param {number} duration
 *
 * @returns {number}
 */
import priceFormatter from './priceFormatter';

export function counterEffect(el, startValue, endValue, duration) {
  let timer;

  // assumes integer values for start and end

  let range = endValue - startValue;
  // no timer shorter than 50ms (not really visible any way)
  let minTimer = 100;
  // calc step time to show all interediate values
  // never go below minTimer
  let stepTime = Math.max(Math.abs(Math.floor(duration / range)), minTimer);

  // get current time and calculate desired end time
  let startTime = new Date().getTime();
  let endTime = startTime + duration;

  function run() {
    let now = new Date().getTime();

    if (now > endTime) {
      el.innerHTML = priceFormatter(endValue);
      clearInterval(timer);
    } else {
      let remaining = Math.max((endTime - now) / duration, 0);
      let value = endValue - remaining * range;
      el.innerHTML = priceFormatter(value.toFixed(2));
    }
  }

  timer = setInterval(run, stepTime);
  run();
}
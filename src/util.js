const RAF = window.requestAnimationFrame;
const CAF = window.cancelAnimationFrame;

/**
 * @param {Function} fn 
 * @param {any} self 
 * @param  {...any} args 
 */
const call = function (fn, self, ...args) {
  if (typeof fn === "function") {
    fn.call(self, ...args);
  }
};

/**
 * @param {Function} fn 
 * @param {number} delay 
 * @returns {()=>void}
 */
export const setTimer = function (fn, delay) {
  let timer, canceled = false;
  let start = Date.now();

  const cancel = () => {
    canceled = true
    timer && CAF(timer);
  }

  const loop = () => {

    if (canceled) {
      return
    }

    if (Date.now() - start >= delay) {
      cancel()
      call(fn, this, timer)
      return;
    }

    timer = RAF(loop);

  };
  loop();
  return cancel;
};

/**
 * @param {Function} fn 
 * @param {number} [delay = 16]
 * @returns 
 */
export const debounce = function (fn, delay = 16) {
  let cancel;
  const debounced = function () {
    const context = this;
    const args = arguments;

    if (cancel) cancel();

    cancel = setTimer(() => fn.apply(context, args), delay);

  };

  debounced.cancel = function () {
    cancel && cancel();
    cancel = null;
  };

  return debounced;
};


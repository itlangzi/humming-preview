// @ts-ignore
import App from "./index.svelte";

class Humming {
  /**
   * @param {string | HTMLElement | Array<HTMLElement>} selector images selector
   * @param {HTMLElement} [mounted=document.body] modal dialog mount at
   */
  constructor(selector, mounted) {
    new App({
      target: mounted instanceof HTMLElement ? mounted : document.body,
      props: {
        selector,
      },
    });
  }
}

const selectors = []

/**
 * @param {string | any[] | NodeListOf<Element>} imgs
 */
function detect(imgs) {
  if (imgs && imgs.length) {
    for (let img of imgs) {
      if (selectors.indexOf(img) == -1) {
        selectors.push(img)
      }
    }
  }
}

detect(document.querySelectorAll("[data-humming] img"))
detect(document.querySelectorAll("[data-humming-img]"))

if (selectors.length) {
  // @ts-ignore
  new Humming(selectors)
}

export default Humming;

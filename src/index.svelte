<script>
  import { crossfade, fade, scale as scaleAnim } from "svelte/transition";
  import { onDestroy } from "svelte";

  import RorateLeft from "./icons/rotate-left.svelte";
  import RorateRight from "./icons/rotate-right.svelte";
  import ZoomOut from "./icons/zoom-out.svelte";
  import ZoomIn from "./icons/zoom-in.svelte";
  import Close from "./icons/close.svelte";
  import ArrowLeft from "./icons/arrow-left.svelte";
  import ArrowRight from "./icons/arrow-right.svelte";
  import Reset from "./icons/reset.svelte";
  import Loading from "./icons/loading.svelte";

  import { debounce, setTimer } from "./util";

  export let selector = null;

  const isMobile =
    /Mobile|Android|iOS|iPhone|iPad|iPod|Windows Phone|KFAPWI/i.test(
      navigator.userAgent,
    );

  // const keydownEvent = isMobile ? "touchstart" : "keydown";
  // const mouseupEvent = isMobile ? "touchend" : "mouseup";
  // const mousedownEvent = isMobile ? "touchstart" : "mousedown";
  // const mousemoveEvent = isMobile ? "touchmove" : "mousemove";
  // const clickEvent = isMobile ? "touchstart" : "click";
  // const resizeEvent = "resize";

  const translation = 100;
  const transitionDuration = 500;

  const previewTransition = { duration: transitionDuration };

  const [send, receive] = crossfade({
    duration: 200,
    fallback: scaleAnim,
  });
  const [maskSend, maskReceive] = crossfade({
    duration: 200,
    fallback: fade,
  });
  // 前后预加载的个数 preloadNum *  2
  let preloadNum = 3;
  // 加载中
  let loading = false;
  let loadingIndicator = null;
  // 预览图层显示
  let visible = false;
  // 所有的img元素
  /** @type {(HTMLElement|HTMLImageElement)[]|null} */
  let images = null;
  // 预加载中的图片的下标
  /** @type {number[]} */
  let preloading = [];
  // 缓存已经加载的图
  /** @type {{string?:HTMLImageElement}} */
  let loaded = {};
  // 上一个预览的原始img元素
  // let prevPreviewImage = null;
  // 正在预览的原始img元素
  /** @type {?HTMLImageElement} */
  let previewedImage = null;

  // 缩放
  let scale = 1;
  // 旋转
  let roate = 0;
  // 上一个下一个img下标
  let currentIndex = -1;
  // img元素总数
  let total = 0;
  // 拖拽x坐标
  let x = 0;
  // 拖拽y坐标
  let y = 0;
  // 拖拽开始x坐标
  let oriX = 0;
  // 拖拽结束y坐标
  let oriY = 0;
  // 是否正在移动(拖拽中)
  let isMoveing = false;
  // 预览元素
  let ref = null;
  // 取消执行计算函数
  let cancel;
  // 拖拽结束开始执行计算坐标超时时间
  let timeout = 200;
  // 拖拽结束时间（number）
  let moveEnd = 0;

  // 是否是横屏
  // 用于手机端
  let landscape =
    screen.orientation?.angle === 90 || screen.orientation?.angle === -90;

  /**
   * @param {PointerEvent} event
   */
  const offset = (event) => {
    let e = null;
    if (event instanceof TouchEvent) {
      e = event.changedTouches[0];
    } else {
      e = event;
    }
    return { x: e.pageX, y: e.pageY };
  };

  /**
   * @return {{width:number,height:number}} {width: document.documentElement.clientWidth, height: document.documentElement.clientHeight }
   */
  const getClientSize = () => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };
  };

  /**
   * @param {HTMLElement|HTMLImageElement} el
   * @returns {Promise}
   */
  const load = function (el) {
    let preview = el.getAttribute("data-preview");
    if (!preview) {
      preview = el.getAttribute("data-src");
    }
    // @ts-ignore
    if (!preview && el.src) {
      // @ts-ignore
      preview = el.src;
    }
    if (preview) {
      if (loaded[preview]) {
        // 已经加载过
        return Promise.resolve(loaded[preview]);
      }
      const img = new Image();
      img.src = preview;
      // @ts-ignore
      img.alt = el.alt;

      // 前一个
      // TODO
      return new Promise((resolve, reject) => {
        img.onload = function () {
          loaded[preview] = img;
          resolve(img);
        };
        img.onerror = function () {
          reject();
        };
      });
    }
    return Promise.reject();
  };

  let preloadingNext = false;
  /**
   * 预加载方法
   */
  const preloadNext = function () {
    if (preloadingNext) {
      return;
    }
    if (preloading.length > 0) {
      preloadingNext = true;
      // 批量预加载
      let curPreloadingNextNum = preloadNum * 2;
      const indexs = preloading.splice(0, curPreloadingNextNum);
      indexs.forEach((index) => {
        load(images[index])
          .then(() => {
            curPreloadingNextNum--;
            if (curPreloadingNextNum <= 0) {
              preloadingNext = false;
              preloadNext();
            }
          })
          .catch(() => {
            curPreloadingNextNum--;
            if (curPreloadingNextNum <= 0) {
              preloadingNext = false;
              preloadNext();
            }
          });
      });
    }
  };

  /**
   * 预加载
   * @param {number} curIndex
   */
  const preload = function (curIndex) {
    if (preloadNum <= 0 || curIndex < 0 || !images) {
      return;
    }
    const start = Math.max(curIndex - preloadNum, 0);
    const end = Math.min(start + preloadNum * 2 + 1, images.length || 0);
    if (end <= 0) {
      return;
    }
    let indexs = Array(end - start)
      .fill(0)
      .map((_, i) => i + start);

    const i = indexs.findIndex((i) => i === curIndex);
    if (i > -1) {
      indexs.splice(i, 1);
    }

    // 去重
    // 按优先级排序并去除已经加载或正在加载的
    indexs = [
      ...indexs.slice(i, indexs.length),
      ...indexs.slice(0, i).reverse(),
    ].filter((item) => {
      return preloading.indexOf(item) === -1;
    });
    if (indexs.length) {
      preloading.push(...indexs);
      preloadNext();
    }
  };

  /**
   * @param {number} curIndex
   */
  const setPreview = function (curIndex) {
    if (curIndex < 0) {
      return;
    }

    const el = images[curIndex];
    if (!el) {
      return;
    }
    loadingIndicator = setTimer(() => {
      // 防止抖动
      loading = true;
    }, 200);

    if (preloading.indexOf(curIndex) > -1) {
      // 删除，使用当前的直接加载
      preloading.splice(curIndex, 1);
    }

    preload(curIndex);

    load(el)
      .then((img) => {
        // 滚动到视野中
        el.scrollIntoView();
        previewedImage = img;
      })
      .catch(() => {});
  };

  const onPreview = debounce(function (
    /** @type {{target:HTMLImageElement}} */ e,
  ) {
    document.documentElement.style.overflowY = "hidden";
    currentIndex = images.indexOf(e.target);
    visible = true;
    setPreview(currentIndex);
  }, 150);

  /**
   * @param {KeyboardEvent} e
   */
  const onKeydown = function (e) {
    if (isMobile || !previewedImage) {
      return;
    }

    if (e instanceof TouchEvent) {
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    switch (e.key) {
      case "ArrowRight":
        onNext();
        break;
      case "ArrowLeft":
        onPrev();
        break;
      case "+":
        onZoomIn();
        break;
      case "-":
        onZoomOut();
        break;
    }
  };
  const onClose = function () {
    document.documentElement.style.overflowY = "";
    previewedImage = null;
    // prevPreviewImage = null;
    visible = false;
    ref = null;
    loading = false;
    loadingIndicator && loadingIndicator();
    loadingIndicator = null;
    currentIndex = -1;
    onReset();
  };

  /**
   * @param {WheelEvent} e
   */
  const onWheel = function (e) {
    if (e.deltaY < 0) {
      onZoomIn();
    } else {
      onZoomOut();
    }
  };

  /**
   * @param {PointerEvent} event
   */
  const isImage = function (event) {
    let e = null;
    if (event instanceof TouchEvent) {
      e = event.changedTouches[0];
    } else {
      e = event;
    }

    return (
      e && e.target["tagName"] && e.target["tagName"].toUpperCase() === "IMG"
    );
  };
  /**
   *
   * @param {number} start left | top
   * @param {number} width width | height
   * @param {number} clientWidth clientwidth | clientHeight
   * @return {number|false}
   */
  const fixPoint = function (start, width, clientWidth) {
    const overflowOffset = width - clientWidth;
    const translateOffset = overflowOffset / 2;

    if (start < 0 && start <= -overflowOffset) {
      return -translateOffset;
    }
    if (start > 0) {
      return translateOffset;
    }
    return false;
  };

  /**
   *
   */
  const onEnd = function () {
    isMoveing = false;
    // setTimer 等待平移完成后获取准确的left值
    const doEnd = () => {
      if (scale <= 1 && Math.abs(x) > translation) {
        if (x > 0) {
          if (currentIndex > 0) {
            // prevPreviewImage = previewedImage;
            // previewedImage = null;
            onPrev();
          }
        } else {
          if (currentIndex < total - 1) {
            // prevPreviewImage = previewedImage;
            // previewedImage = null;
            onNext();
          }
        }
      }
      if (ref) {
        let { width, height, left, top } = ref.getBoundingClientRect();
        const { height: clientHeight, width: clientWidth } = getClientSize();

        if (width < clientWidth) {
          x = 0;
        } else {
          const x1 = fixPoint(left, width, clientWidth);
          if (x1 !== false && x1 !== x) {
            x = x1;
          }
        }
        if (height < clientHeight) {
          y = 0;
        } else {
          const y1 = fixPoint(top, height, clientHeight);
          if (y1 !== false) {
            y = y1;
          }
        }
      }
    };
    cancel && cancel();

    if (Date.now() - moveEnd >= timeout) {
      doEnd();
    } else {
      cancel = setTimer(doEnd, timeout);
    }
    moveEnd = 0;
  };
  /**
   * @param {PointerEvent} e
   */
  const onStart = function (e) {
    if (isImage(e)) {
      const xy = offset(e);
      oriX = xy.x - x;
      oriY = xy.y - y;
      isMoveing = true;
    }
  };

  /**
   * @param {PointerEvent} e
   */
  const onMove = function (e) {
    if (isMoveing) {
      const xy = offset(e);
      x = xy.x - oriX;
      y = xy.y - oriY;
      moveEnd = Date.now();
    }
  };

  const onReset = function () {
    scale = 1;
    roate = 0;
    x = 0;
    y = 0;
    oriX = 0;
    oriY = 0;
    isMoveing = false;
  };
  /**
   * 缩小
   */
  const onZoomOut = function () {
    if (scale > 1) {
      scale = scale - 1;
      x = x * (1 - 1 / scale);
      y = y * (1 - 1 / scale);
    }
  };
  /**
   * 放大
   */
  const onZoomIn = function () {
    scale = scale + 1;
  };
  const onRoateLeft = function () {
    roate = roate - 90;
  };
  const onRoateRight = function () {
    roate = roate + 90;
  };

  const onPrev = function () {
    if (currentIndex > 0) {
      currentIndex = currentIndex - 1;
      setPreview(currentIndex);
    }
  };
  const onNext = function () {
    if (currentIndex < total - 1) {
      currentIndex = currentIndex + 1;
      setPreview(currentIndex);
    }
  };

  /**
   * @param {HTMLElement} el
   * @param {"pointerdown"|"pointerup"|"pointermove"} eventName
   * @param {(e?:PointerEvent)=>void} [action]
   * @returns {import("svelte/action").ActionReturn}
   */
  const stopPropagationHandler = (el, eventName, action) => {
    /**
     * @param {PointerEvent} e
     */
    const onAction = function (e) {
      if (e.pointerType === "mouse" && e.buttons > 1) {
        // event.buttons = 1 左键
        // event.buttons = 0 没有按键
        // 只响应左键
        return;
      }
      e.stopPropagation();
      if (typeof action === "function") {
        action(e);
      }
    };
    el.addEventListener(eventName, onAction);
    return {
      destroy() {
        el.removeEventListener(eventName, onAction);
      },
    };
  };

  /**
   * @param {HTMLElement} el
   * @returns {import("svelte/action").ActionReturn}
   */
  const windowHandler = (el) => {
    /* el.addEventListener(resizeEvent, function (e) {
      onResize();
    }); */

    const windowPointerup = stopPropagationHandler(
      el,
      "pointerup",
      function (e) {
        if (isMoveing) {
          onEnd();
        } else if (visible) {
          onClose();
        }
      },
    );

    if (!isMobile) {
      el.addEventListener("keydown", onKeydown);
    }
    let onOrientationchange = null;
    if (isMobile) {
      onOrientationchange = function () {
        if (
          screen.orientation.angle === 90 ||
          screen.orientation.angle === -90
        ) {
          // 横屏
          landscape = true;
        } else {
          landscape = false;
        }
      };
      el.addEventListener("orientationchange", onOrientationchange);
    }
    return {
      destroy: () => {
        windowPointerup.destroy();
        if (!isMobile) {
          el.removeEventListener("keydown", onKeydown);
        }
        if (onOrientationchange) {
          el.removeEventListener("orientationchange", onOrientationchange);
        }
      },
    };
  };

  /**
   * @param {HTMLElement} el
   * @param {(e?:PointerEvent)=>void} [action]
   * @returns {import("svelte/action").ActionReturn}
   */
  const actionsHandler = (el, action) => {
    const pointerup = stopPropagationHandler(el, "pointerup", action);
    return {
      destroy() {
        pointerup.destroy();
      },
    };
  };

  /**
   * @param {HTMLElement} el
   * @returns {import("svelte/action").ActionReturn}
   */
  const previewdImageHandler = (el) => {
    let wheelEventOptions = null;
    if (!isMobile) {
      wheelEventOptions = { passive: false };
      el.addEventListener("wheel", onWheel, wheelEventOptions);
    }
    const onFinish = function () {
      loadingIndicator && loadingIndicator();
      loading = false;
    };
    el.addEventListener("load", onFinish);
    el.addEventListener("error", onFinish);
    const pointerdown = stopPropagationHandler(el, "pointerdown", onStart);

    return {
      destroy() {
        if (!isMobile) {
          el.removeEventListener("wheel", onWheel, wheelEventOptions);
        }
        el.removeEventListener("load", onFinish);
        el.removeEventListener("error", onFinish);
        pointerdown.destroy();
      },
    };
  };

  /**
   * @param {HTMLElement} el
   * @returns {import("svelte/action").ActionReturn}
   */
  const previewdMoveHandler = (el) => {
    const pointermove = stopPropagationHandler(el, "pointermove", onMove);
    return {
      destroy() {
        pointermove.destroy();
      },
    };
  };

  /**
   * @type {import("svelte/action").ActionReturn[]}
   */
  let imageActionReturns = [];
  $: {
    total = 0;
    if (!selector) {
      selector = Array.from(document.querySelectorAll("img") || []);
    }
    if (Array.isArray(selector)) {
      const _selector = selector.filter((item) => item instanceof HTMLElement);
      if (_selector && _selector.length) {
        images = _selector;
        total = images.length;
      }
    } else if (selector instanceof HTMLElement) {
      images = [selector];
      total = 1;
    } else if (typeof selector === "string") {
      images = Array.from(document.querySelectorAll(selector));
      if (images && images.length > 0) {
        total = images.length;
      }
    }
    if (images && images.length > 0) {
      images.forEach((/** @type {HTMLImageElement} */ img) => {
        imageActionReturns.push(
          stopPropagationHandler(img, "pointerdown", onPreview),
        );
        imageActionReturns.push(
          stopPropagationHandler(img, "pointermove", function (e) {
            if (e.pointerType === "mouse" && e.buttons !== 1) {
              return;
            }
            onPreview.cancel();
          }),
        );
      });
    }
  }

  onDestroy(() => {
    if (imageActionReturns.length) {
      imageActionReturns.forEach((item) => item.destroy());
      imageActionReturns = [];
    }
  });
</script>

<svelte:window use:windowHandler />
{#if visible}
  <div
    class="h-preview-root"
    in:maskReceive|global={{ key: "mask" }}
    out:maskSend|global={{ key: "mask" }}
  >
    <div class="h-preview">
      <div class="h-preview-actions">
        <div class:h-disabled={loading} use:actionsHandler={onReset}>
          <Reset />
        </div>
        <div class:h-disabled={loading} use:actionsHandler={onRoateLeft}>
          <RorateLeft />
        </div>
        <div class:h-disabled={loading} use:actionsHandler={onRoateRight}>
          <RorateRight />
        </div>
        <div
          class:h-disabled={loading || scale <= 1}
          use:actionsHandler={onZoomOut}
        >
          <ZoomOut />
        </div>
        <div class:h-disabled={loading} use:actionsHandler={onZoomIn}>
          <ZoomIn />
        </div>
        <div use:actionsHandler={onClose}>
          <Close />
        </div>
      </div>

      <div class="h-preview-image" use:previewdMoveHandler>
        {#if previewedImage}
          {#await previewedImage then d}
            <img
              bind:this={ref}
              src={d.src}
              alt={d.alt}
              draggable="false"
              style="transform:translate3d({x}px, {y}px, 0px) scale3d({scale}, {scale}, 1) rotate({roate}deg);"
              use:previewdImageHandler
            />
          {/await}
        {/if}
      </div>
      {#if total > 1}
        <div
          class="h-preview-prev"
          class:h-disabled={currentIndex <= 0 || loading}
          class:h-preview-prev-landscape={landscape}
          use:actionsHandler={onPrev}
        >
          <ArrowLeft />
        </div>
        <div
          class="h-preview-next"
          class:h-disabled={currentIndex >= total - 1 || loading}
          class:h-preview-next-landscape={landscape}
          use:actionsHandler={onNext}
        >
          <ArrowRight />
        </div>
      {/if}
      {#if loading}
        <div class="h-loading" use:stopPropagationHandler={"pointerup"}>
          <span>
            <Loading />
          </span>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .h-preview-root * {
    box-sizing: border-box;
  }
  .h-preview-root {
    background-color: #00000073;
  }
  :global(.h-preview-icon) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .h-preview-root,
  .h-loading,
  .h-preview {
    position: fixed;
    inset: 0;
    z-index: 1000;
    height: 100vh;
    width: 100%;
    top: 0;
    overflow: hidden;
    inset: 0;
    outline: 0;
    -webkit-overflow-scrolling: touch;
  }
  .h-preview-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    color: #ffffffa6;
    list-style: none;
    background: rgba(0, 0, 0, 0.4);
    pointer-events: auto;
    font-size: 1.125rem;
    font-variant: tabular-nums;
    line-height: 1.5715;
    font-feature-settings: "tnum";
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1003;
  }
  .h-preview-actions > div {
    padding: 0.75rem;
    cursor: pointer;
  }
  .h-preview-prev.h-disabled,
  .h-preview-next.h-disabled,
  .h-preview-actions > div.h-disabled {
    color: #ffffff40;
  }
  .h-preview-prev.h-disabled,
  .h-preview-next.h-disabled {
    cursor: not-allowed;
  }
  .h-preview-actions > div:not(.h-disabled):hover {
    color: rgb(255 255 255);
  }
  .h-preview-image {
    user-select: none;
    text-align: center;
    position: absolute;
    inset: 0;
    height: 100vh;
    transition: transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .h-preview-image > img {
    position: absolute;
    max-width: 100%;
    max-height: 100%;
    vertical-align: middle;
    transform: scale(1);
    cursor: grab;
    transition: transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    user-select: none;
    pointer-events: auto;
  }
  .h-preview-prev,
  .h-preview-next {
    position: absolute;
    top: 48%;
    right: 0.625rem;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    color: #ffffffd9;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    cursor: pointer;
    pointer-events: auto;
    transition: all 0.3s;
    font-size: 1.5rem;
  }
  .h-preview-prev {
    right: unset;
    left: 0.625rem;
  }
  .h-preview-prev:not(.h-disabled):hover,
  .h-preview-next:not(.h-disabled):hover {
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
  }

  .h-preview-prev.h-preview-prev-landscape,
  .h-preview-next.h-preview-next-landscape {
    left: 50%;
    transform: rotate(90deg);
  }
  .h-preview-prev.h-preview-prev-landscape {
    top: 0.625rem;
    z-index: 1004;
  }
  .h-preview-next.h-preview-next-landscape {
    bottom: 0.625rem;
    top: auto;
  }
  .h-loading {
    z-index: 1002;
    font-size: 3rem;
    color: #fff;
  }
  .h-loading > span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -100%);
  }
</style>

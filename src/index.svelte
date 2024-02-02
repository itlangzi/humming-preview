<script>
  import { fade } from "svelte/transition";
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
  import Lightbulb from "./icons/lightbulb.svelte";

  import { debounce, setTimer } from "./util";

  export let selector = null;

  const isMobile =
    /Mobile|Android|iOS|iPhone|iPad|iPod|Windows Phone|KFAPWI/i.test(
      navigator.userAgent,
    );

  const translation = isMobile ? 24 : 100;

  // 总预加载的个数 preloadNum *  2 + 1
  let preloadNum = 3;
  // 加载中
  let loading = false;
  let loadingCancel = null;
  // 预览图层显示
  let visible = false;
  // 所有的img元素
  /** @type {(HTMLElement|HTMLImageElement)[]|null} */
  let images = null;

  /** @type {({src:string,alt:string})[]} */
  let previewImages = [];

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
  let ref = [];
  // let ref2 = null;
  // 取消执行计算函数
  let cancel;
  // 拖拽结束开始执行计算坐标超时时间
  let timeout = 200;
  // 拖拽结束时间（number）
  let moveEnd = 0;

  // 是否开灯
  let isLight = true;

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
   * @param {number} index
   */
  const setLoading = (index) => {
    if (!ref[index]) {
      // 100 毫秒延迟,防抖
      loadingCancel = setTimer(() => {
        loading = true;
      }, 100);
    }
  };

  const calcelLoading = () => {
    loadingCancel && loadingCancel();
    loadingCancel = null;
    loading = false;
  };
  /**
   * @param {number} index
   */
  const scrollIntoView = (index) => {
    const el = images[index];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
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

  const onPreview = debounce(function (
    /** @type {{target:HTMLImageElement}} */ e,
  ) {
    document.documentElement.style.overflowY = "hidden";
    currentIndex = images.indexOf(e.target);
    visible = true;
    setLoading(currentIndex);
  }, 60);

  /**
   * @param {KeyboardEvent} e
   */
  const onKeydown = function (e) {
    if (isMobile || !previewImages.length) {
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
    previewImages = [];
    visible = false;
    ref = [];
    loading = false;
    calcelLoading();
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
   * 移动结束
   */
  const onMoveEnd = function () {
    isMoveing = false;
    // setTimer 等待平移完成后获取准确的left值
    const doEnd = () => {
      if (scale <= 1 && Math.abs(x) > translation) {
        if (x > 0) {
          if (currentIndex > 0) {
            onPrev();
            x = 0;
            y = 0;
          }
        } else {
          if (currentIndex < total - 1) {
            onNext();
            x = 0;
            y = 0;
          }
        }
      }

      if (ref[currentIndex]) {
        let { width, height, left, top } =
          ref[currentIndex].getBoundingClientRect();
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
   * 开始移动
   * @param {PointerEvent} e
   */
  const onMoveStart = function (e) {
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
  const onMoving = function (e) {
    if (isMoveing) {
      const xy = offset(e);
      x = xy.x - oriX;
      y = xy.y - oriY;
      moveEnd = Date.now();
    }
  };

  const onLight = function () {
    isLight = !isLight;
  };

  const onReset = function () {
    scale = 1;
    roate = 0;
    x = 0;
    y = 0;
    oriX = 0;
    oriY = 0;
    isMoveing = false;
    isLight = true;
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
      setLoading(currentIndex);
      scrollIntoView(currentIndex);
    }
  };
  const onNext = function () {
    if (currentIndex < total - 1) {
      currentIndex = currentIndex + 1;
      setLoading(currentIndex);
      scrollIntoView(currentIndex);
    }
  };

  /**
   * @param {HTMLElement} el
   * @param {"pointerdown"|"pointerup"|"pointermove"} eventName
   * @param {(e?:PointerEvent)=>void} [action]
   * @returns {?import("svelte/action").ActionReturn}
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
          onMoveEnd();
        } /* else if (visible) {
          onClose();
        } */
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

    el.addEventListener("load", calcelLoading);
    el.addEventListener("error", calcelLoading);
    const pointerdown = stopPropagationHandler(el, "pointerdown", onMoveStart);

    return {
      destroy() {
        if (!isMobile) {
          el.removeEventListener("wheel", onWheel, wheelEventOptions);
        }
        el.removeEventListener("load", calcelLoading);
        el.removeEventListener("error", calcelLoading);
        pointerdown.destroy();
      },
    };
  };

  /**
   * @param {HTMLElement} el
   * @returns {import("svelte/action").ActionReturn}
   */
  const previewdMoveHandler = (el) => {
    const pointermove = stopPropagationHandler(el, "pointermove", onMoving);
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
          stopPropagationHandler(img, "pointerup", onPreview),
        );
      });
    }
  }
  $: {
    if (visible && images.length > 0) {
      previewImages = images.map((el, index) => {
        let src = el.getAttribute("data-preview");
        if (!src) {
          src = el.getAttribute("data-src");
        }
        // @ts-ignore
        if (!src && el.src) {
          // @ts-ignore
          src = el.src;
        }
        // @ts-ignore
        return { src, alt: el.alt };
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
    style="--preview-index: {currentIndex}; --preview-num: {previewImages.length}; --preview-offset: {0};"
    class:h-light={isLight}
    in:fade
    out:fade
  >
    <div class="h-preview">
      <div class="h-preview-actions" use:stopPropagationHandler={"pointerup"}>
        <div class="h-preview-pages">{currentIndex + 1}/{total}</div>
        <div class="h-preview-icons">
          <div use:actionsHandler={onLight}>
            <Lightbulb />
          </div>
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
      </div>
      <div class="h-preview-sliders-container" use:previewdMoveHandler>
        <div class="h-preview-sliders">
          {#if previewImages.length}
            {#each previewImages as item, index (item.src)}
              <div
                class="h-preview-slider"
                class:h-preview-slider-active={index === currentIndex}
              >
                <!-- 只需要对前一个和后一个进行平移(使其产生动画效果)，其他的不用平移 -->
                <!-- 不使用全局的--preview-offset实时更新会卡顿 -->
                {#if ref[index] || (index > currentIndex - preloadNum && index < currentIndex + preloadNum)}
                  <img
                    bind:this={ref[index]}
                    src={item.src}
                    alt={item.alt}
                    draggable="false"
                    style="transform:{index === currentIndex
                      ? `translate3d(${x}px, ${y}px, 0px) scale3d(${scale}, ${scale}, 1) rotate(${roate}deg)`
                      : (index === currentIndex - 1 ||
                            index === currentIndex + 1) &&
                          scale <= 1
                        ? `translateX(${x}px)`
                        : ''};"
                    use:previewdImageHandler
                  />
                {/if}
              </div>
            {/each}
          {/if}
        </div>
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
    background-color: rgba(0, 0, 0, 1);
    --preview-num: 6;
    --preview-index: 3;
    --preview-offset: 0;
  }
  .h-preview-root.h-light {
    background-color: rgba(0, 0, 0, 0.5);
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
    justify-content: space-between;
    align-items: center;
    width: 100%;
    color: rgb(255 255 255 / 60%);
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
  .h-preview-actions .h-preview-icons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .h-preview-actions .h-preview-pages {
    font-size: 0.875rem;
  }
  .h-preview-actions .h-preview-pages,
  .h-preview-actions .h-preview-icons > div {
    padding: 0.75rem 0.5rem;
    cursor: pointer;
  }
  .h-preview-prev.h-disabled,
  .h-preview-next.h-disabled,
  .h-preview-actions div.h-disabled {
    color: #ffffff40;
  }
  .h-preview-prev.h-disabled,
  .h-preview-next.h-disabled {
    cursor: not-allowed;
  }
  .h-preview-sliders-container {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    touch-action: none;
    user-select: none;
    align-items: center;
    display: flex;
    /* justify-content: center; */
  }
  .h-preview-sliders {
    user-select: none;
    text-align: center;
    inset: 0;
    height: 100vh;
    transition: transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 auto;
    touch-action: none;
    width: calc(100vw * var(--preview-num));
    transform: translateX(calc(-100vw * var(--preview-index)));
  }

  .h-preview-sliders .h-preview-slider > * {
    position: absolute;
    max-width: 100%;
    max-height: 100%;
    vertical-align: middle;
    transform: scale(1);
    cursor: grab;
    transition: transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    user-select: none;
    pointer-events: auto;
    touch-action: none;
  }
  .h-preview-sliders .h-preview-slider {
    flex: 1 1;
    /* overflow: hidden; */
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* .h-preview-sliders .h-preview-slider:not(.h-preview-slider-active) > * {
    transform: translateX(calc(var(--preview-offset) * 1px));
  } */
  .h-preview-prev,
  .h-preview-next {
    position: absolute;
    top: 45%;
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
  @media (any-hover: hover) {
    .h-preview-actions .h-preview-icons > div:not(.h-disabled):hover {
      color: rgb(255 255 255 / 90%);
    }
    .h-preview-prev:not(.h-disabled):hover,
    .h-preview-next:not(.h-disabled):hover {
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
    }
  }

  /* .h-preview-prev.h-preview-prev-landscape,
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
  } */
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

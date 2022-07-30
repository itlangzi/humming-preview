<script>
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
      navigator.userAgent
    );

  const keydownEvent = isMobile ? "touchstart" : "keydown";
  const mouseupEvent = isMobile ? "touchend" : "mouseup";
  const mousedownEvent = isMobile ? "touchstart" : "mousedown";
  const mousemoveEvent = isMobile ? "touchmove" : "mousemove";
  const clickEvent = isMobile ? "touchstart" : "click";
  // const resizeEvent = "resize";

  // 缓存已经加载的图
  let loaded = {};
  // 加载中
  let loading = false;
  // 预览图层显示
  let visible = false;
  // 所有的img元素
  let images = null;
  // 正在预览的原始img元素
  let image = null;
  // 缩放
  let scale = 1;
  // 旋转
  let roate = 0;
  // 上一个下一个img下标
  let index = -1;
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

  /**
   * @param {MouseEvent|TouchEvent} event
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
   *
   * @param {HTMLImageElement} target
   */
  const setPreviewImage = function (target) {
    const preview = target.getAttribute("data-preview");
    if (preview) {
      if (loaded[preview]) {
        image = loaded[preview];
      } else {
        const img = new Image();
        img.src = preview;
        img.alt = target.alt;
        loading = true;
        if (target.src) {
          // fallback
          image = target;
        }
        img.onload = function () {
          loading = false;
          image = img;
          loaded[preview] = img;
        };
        img.onerror = function () {
          loading = false;
          if (target.src) {
            image = target;
          }
        };
      }
    } else {
      if (target.src) {
        image = target;
      }
    }
  };

  const onImage = debounce(function (
    /** @type {{target:HTMLImageElement}} */ e
  ) {
    document.documentElement.style.overflowY = "hidden";
    const target = e.target;
    setPreviewImage(target);
    index = images.indexOf(image);
    visible = true;
  },
  150);

  /**
   * @param {KeyboardEvent|TouchEvent} e
   */
  const onKeydown = function (e) {
    if (isMobile || !image) {
      return;
    }

    if (e instanceof TouchEvent) {
      return;
    }

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
    image = null;
    visible = false;
    ref = null;
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
   * @param {MouseEvent|TouchEvent} event
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
   * @param {MouseEvent|TouchEvent} e
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
   * @param {MouseEvent|TouchEvent} e
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
    if (index > 0) {
      index = index - 1;
      images[index] && setPreviewImage(images[index]);
    }
  };
  const onNext = function () {
    if (index < total - 1) {
      index = index + 1;
      images[index] && setPreviewImage(images[index]);
    }
  };

  /**
   * @param {HTMLElement} el
   */
  const windowHandler = (el) => {
    /* el.addEventListener(resizeEvent, function (e) {
      onResize();
    }); */
    el.addEventListener(mouseupEvent, function (e) {
      onEnd();
    });
    if (!isMobile) {
      el.addEventListener(keydownEvent, function (e) {
        onKeydown(e);
      });
    }
  };

  /**
   * @param {HTMLElement} el
   */
  const closeHandler = (el) => {
    el.addEventListener(clickEvent, function (e) {
      onClose();
    });
  };

  /**
   * @param {HTMLElement} el
   * @param {Function} [action]
   */
  const stopPropagationHandler = (el, action) => {
    el.addEventListener(clickEvent, function (e) {
      e.stopPropagation();
      if (typeof action === "function") {
        action();
      }
    });
  };

  /**
   * @param {HTMLElement} el
   * @param {Function} action
   */
  const actionsHandler = (el, action) => {
    el.addEventListener(clickEvent, function (e) {
      e.preventDefault();
      e.stopPropagation();
      action();
    });
  };

  /**
   * @param {HTMLElement} el
   */
  const previewHandler = (el) => {
    if (!isMobile) {
      el.addEventListener(
        "wheel",
        function (e) {
          onWheel(e);
        },
        { passive: false }
      );
    }
    stopPropagationHandler(el);
    el.addEventListener(mousedownEvent, function (e) {
      onStart(e);
    });
    if (isMobile) {
      el.addEventListener("touchend", function (e) {
        onEnd();
      });
    }
  };

  /**
   * @param {HTMLElement} el
   */
  const moveHandler = (el) => {
    el.addEventListener(mousemoveEvent, function (e) {
      onMove(e);
    });
  };

  $: {
    loaded = {};
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
        img.addEventListener(clickEvent, onImage);
        if (isMobile) {
          img.addEventListener("touchmove", function () {
            onImage.cancel();
          });
        }
      });
    }
  }
</script>

<svelte:window use:windowHandler />
{#if visible}
  <div class="h-preview-root">
    <div class="h-preview" use:closeHandler>
      <div class="h-preview-actions" use:stopPropagationHandler>
        <div class={loading ? "h-disabled" : ""} use:actionsHandler={onReset}>
          <Reset />
        </div>
        <div
          class={loading ? "h-disabled" : ""}
          use:actionsHandler={onRoateLeft}
        >
          <RorateLeft />
        </div>
        <div
          class={loading ? "h-disabled" : ""}
          use:actionsHandler={onRoateRight}
        >
          <RorateRight />
        </div>
        <div
          class={loading || scale <= 1 ? "h-disabled" : ""}
          use:actionsHandler={onZoomOut}
        >
          <ZoomOut />
        </div>
        <div class={loading ? "h-disabled" : ""} use:actionsHandler={onZoomIn}>
          <ZoomIn />
        </div>
        <div use:closeHandler>
          <Close />
        </div>
      </div>

      <div class="h-preview-image" use:moveHandler>
        <!-- style="transform: translate3d({x}px, {y}px, 0px);" -->
        {#if image}
          <img
            bind:this={ref}
            src={image.src}
            alt={image.alt}
            draggable="false"
            style="transform:translate3d({x}px, {y}px, 0px) scale3d({scale}, {scale}, 1) rotate({roate}deg);"
            use:previewHandler
          />
        {/if}
      </div>
      {#if total > 1}
        <div
          class={"h-preview-prev" + (index <= 0 ? " h-disabled" : "")}
          use:stopPropagationHandler={onPrev}
        >
          <ArrowLeft />
        </div>
        <div
          class={"h-preview-next" + (index >= total - 1 ? " h-disabled" : "")}
          use:stopPropagationHandler={onNext}
        >
          <ArrowRight />
        </div>
      {/if}
      {#if loading}
        <div class="h-loading" use:stopPropagationHandler>
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
  .h-preview-actions > div.h-disabled {
    pointer-events: none;
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
    position: relative;
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
    transition: background 0.3s, color 0.3s;
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

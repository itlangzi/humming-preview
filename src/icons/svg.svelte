<script>
  // https://remixicon.com/
  export let name;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span on:click class="h-preview-icon {name ? 'h-preview-icon-' + name : ''}">
  <svg
    viewBox="0 0 24 24"
    focusable="false"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
  >
    <slot />
  </svg>
</span>

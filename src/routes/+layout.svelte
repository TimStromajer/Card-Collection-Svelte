<script>
// @ts-nocheck

  import { onMount, onDestroy } from 'svelte';
  import FixedMenu from './FixedMenu.svelte';

  let mouseCoordinates = {x: null, y: null};

  onMount(() => {
    window.addEventListener('mousemove', handleMouseMove);
  });

  function handleMouseMove(event) {
    mouseCoordinates = { x: event.clientX, y: event.clientY };
  }
</script>
  
<nav>
  <a href="/">My collection</a>
  <a href="/decks">Decks</a>
</nav>

<slot />

<div>
  <FixedMenu mousePosition={mouseCoordinates}></FixedMenu>
</div>
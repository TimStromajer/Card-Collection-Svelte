<script>
// @ts-nocheck

  import { onMount, onDestroy } from 'svelte';
  import FixedMenu from './FixedMenu.svelte';
  import { mouseCoordinates } from '../stores/userInfo';

  export let mouseCoord = {x: null, y: null};

  onMount(() => {
    window.addEventListener('mousemove', handleMouseMove);
  });

  function handleMouseMove(event) {
    mouseCoord = { x: event.clientX, y: event.clientY };
    $mouseCoordinates = mouseCoord
  }
</script>
  
<nav>
  <a href="/">Home</a>
  <a href="/collection">Collections</a>
  <a href="/decks">Decks</a>
</nav>

<slot />

<div>
  <FixedMenu mousePosition={mouseCoord}></FixedMenu>
</div>
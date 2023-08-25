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

<div class="content">
  <slot class="slot"/>
</div>

<div>
  <FixedMenu mousePosition={mouseCoord}></FixedMenu>
</div>

<style>
  nav {
    padding: 1em;
    background-color: rgb(4, 27, 2);
  }

  nav a {
    color: rgb(72, 197, 83);
    margin-right: 1em;
  }

  .content {
    margin-left: 1em;
    margin-right: 1em;
  }
</style>
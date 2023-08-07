<script>
// @ts-nocheck

  import FixedMenu from "./FixedMenu.svelte";
  import CardList from "./CardList.svelte";
  import { onMount, onDestroy } from 'svelte';
  import { deckStore } from "../stores/deckStore";
  import { Deck } from "$lib/deck";
  import { collection } from "../stores/collection";
  import { collectionData } from "../database/database";

  let mouseCoordinates = {x: null, y: null};

  deckStore.update(() => 
    new Deck()
  )

  onMount(() => {
    window.addEventListener('mousemove', handleMouseMove);

    $collection = collectionData
  });

  function handleMouseMove(event) {
    mouseCoordinates = { x: event.clientX, y: event.clientY };
  }
</script>

<div>
  <h1>My collection</h1>

  <CardList></CardList>

  <FixedMenu mousePosition={mouseCoordinates}></FixedMenu>
</div>

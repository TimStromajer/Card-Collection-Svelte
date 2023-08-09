<script>
// @ts-nocheck

  import FixedMenu from "./FixedMenu.svelte";
  import CardList from "./CardList.svelte";
  import { onMount, onDestroy } from 'svelte';
  import { deckStore } from "../stores/deckStore";
  import { Deck } from "$lib/deck";
  import { collection } from "../stores/collection";
  import { collectionData,resetCollection } from "../database/database";

  import { getCollection } from "../database/dbService";
	import { Card } from "$lib/card";

  let mouseCoordinates = {x: null, y: null};

  deckStore.update(() => 
    new Deck()
  )

  onMount(() => {
    window.addEventListener('mousemove', handleMouseMove);

    $collection = collectionData
    // $collection = resetCollection("slotim")
    getCollection("slotim").then(col => {
      if (col) {
        for (let card of col.cards) {
          $collection.push(new Card(card.name, card.setCode, card.collectorCode, card.printing,
            card.scryfallId, card.price, card.imgSUrl,
            card.imgNUrl, card.imgLUrl, card.colorIdentity, card.cmc, card.manaCost, card.rarity, card.typeLine, card.oracleText))
          $collection = $collection
        }
        return collection
      }
    })
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

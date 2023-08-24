<script>
// @ts-nocheck

  import CardList from "./CardList.svelte";
  import { onMount, onDestroy } from 'svelte';

  import { deckStore } from "../../../stores/deckStore";
  import { collection } from "../../../stores/collection";

  import { getCollection } from "../../../database/dbService";

  import { Deck } from "$lib/deck";
	import { Card } from "$lib/card";

  export let data;

  let mouseCoordinates = {x: null, y: null};

  let username = data.username

  onMount(() => {

    if (!$deckStore) {
      deckStore.update(() => 
        new Deck()
      )
    }

    if (!$collection) {
      $collection = []
      resetCol(username)
    }

  });

  export function resetCol(username) {
    $collection = []
    var itemsProcessed = 0;
    getCollection(username).then(col => {
      if (col) {
        col.forEach(item => {
          let card = item.cardInfo
          $collection.push(new Card(card.name, card.setCode, card.collectorCode, card.printing,
            card.scryfallId, card.price, card.imgSUrl,
            card.imgNUsrl, card.imgLUrl, card.colorIdentity, card.cmc, card.manaCost, card.rarity, card.typeLine, card.oracleText, item.amount))
          itemsProcessed++;
          if(itemsProcessed === col.length) {
            sortCards()
            $collection = $collection
          }
        });
        return collection
      }
    })
  }

  function sortCards() {
    $collection.sort((a, b) => {
      // sort by color identity
      if (a.colorIdentity.length < b.colorIdentity.length) {
        return -1
      }
      else if (a.colorIdentity.length > b.colorIdentity.length) {
        return 1;
      }
      // sort by color
      else if (a.colorIdentity.includes("B") && !b.colorIdentity.includes("B")) {
        return -1
      }
      else if (!a.colorIdentity.includes("B") && b.colorIdentity.includes("B")) {
        return 1
      }
      else if (a.colorIdentity.includes("G") && !b.colorIdentity.includes("G")) {
        return -1
      }
      else if (!a.colorIdentity.includes("G") && b.colorIdentity.includes("G")) {
        return 1
      }
      else if (a.colorIdentity.includes("R") && !b.colorIdentity.includes("R")) {
        return -1
      }
      else if (!a.colorIdentity.includes("R") && b.colorIdentity.includes("R")) {
        return 1
      }
      else if (a.colorIdentity.includes("U") && !b.colorIdentity.includes("U")) {
        return -1
      }
      else if (!a.colorIdentity.includes("U") && b.colorIdentity.includes("U")) {
        return 1
      }
      // sort by cmc
      else if (a.cmc < b.cmc) {
        return -1
      } else if (a.cmc > b.cmc) {
        return 1
      }
      else {
        return 1
      }
    })
  }

  function handleMouseMove(event) {
    mouseCoordinates = { x: event.clientX, y: event.clientY };
  }
</script>

<div>
  <br/>

  <CardList username={username}></CardList>

</div>

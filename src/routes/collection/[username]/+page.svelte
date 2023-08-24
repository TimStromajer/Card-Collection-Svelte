<script>
// @ts-nocheck

  import CardList from "./CardList.svelte";
  import { onMount } from 'svelte';

  import { deckStore } from "../../../stores/deckStore";

  import { Deck } from "$lib/deck";

  export let data;

  let username = data.username

  onMount(() => {

    if (!$deckStore) {
      deckStore.update(() => 
        new Deck()
      )
    }

  });
</script>

<div>
  <br/>

  <CardList username={username}></CardList>

</div>

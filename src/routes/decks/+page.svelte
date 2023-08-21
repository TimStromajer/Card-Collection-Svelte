<script>
// @ts-nocheck

  import { onMount } from "svelte";
  import { getDecks, getDeck, deleteDeck } from "../../database/dbService";
  import { deckStore } from "../../stores/deckStore";
	import { Deck } from "$lib/deck";

  let decks;

  onMount(() => {
    loadInitialDecks()
  })

  function openDeck(deck) {

  }

  function loadInitialDecks() {
    getDecks().then(d => {
      decks = d
    })
  }

  async function loadDeck(deck) {
    $deckStore = new Deck()
    let deckCards = await getDeck(deck.username, deck.title)
    deckCards.forEach(c => {
      for (let i = 0; i<c.amount; i++) {
        $deckStore.addCard(c.cardInfo)
      }
    });
    $deckStore = $deckStore
  }
  function downloadDeck(deck) {

  }
  async function deleteDeckBtnClick(deck) {
    let ret = await deleteDeck(deck.username, deck.title)
    loadInitialDecks()
  }

</script>

<h1>Decks</h1>

{#if !decks}
  <div>Loading...</div>
{:else}
  <div class="card-list">
    {#each decks as deck}
      <div class="deck">
        <button class="add-card-btn" on:click={() => openDeck(deck)}>
          <img src="{deck.mainCard}" alt="{deck.title}"/>
          <div>{deck.title}</div>
          <button on:click={() => loadDeck(deck)}>Load</button>
          <button on:click={() => downloadDeck(deck)}>Download</button>
          <button on:click={() => deleteDeckBtnClick(deck)} disabled>Delete</button>
        </button>
      </div>
    {/each}
  </div>
{/if}

<style>
  .card-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .deck {
    height: 13em;
    width: 148px;
    margin-left: 0.5em;
    margin-right: 0.5em;
    margin-bottom: 1.4em;
  }
  .add-card-btn {
    padding: 0;
    margin: 0;
    border: 0;
    height: 95%;
    border-radius: 1em;
    cursor: copy;
  }
  img {
    width: 100%;
    border-radius: 0.6em;
    border: 1px solid black;
    aspect-ratio: 2.5 / 3.5;
  }
</style>

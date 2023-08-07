<script>
// @ts-nocheck

  import { dndzone } from 'svelte-dnd-action'
  import { deckStore } from '../stores/deckStore';

  let cardColumns;
  $: cardColumns = $deckStore.fields
  const flipDurationMs = 200;

  function handleDndConsiderColumns(e) {
    cardColumns = e.detail.items;
    $deckStore.fields = cardColumns;
  }
  function handleDndFinalizeColumns(e) {
    cardColumns = e.detail.items;
    $deckStore.fields = cardColumns;
  }
  function handleDndConsiderCards(cid, e) {
    const colIdx = cardColumns.findIndex(c => c.id === cid);
    cardColumns[colIdx].cards = e.detail.items;
    cardColumns = [...cardColumns];
    $deckStore.fields = cardColumns;
  }
  function handleDndFinalizeCards(cid, e) {
    const colIdx = cardColumns.findIndex(c => c.id === cid);
    cardColumns[colIdx].cards = e.detail.items;
    cardColumns = [...cardColumns];
    $deckStore.fields = cardColumns;
  }
  function getDeckDropListStyle(column) {
    return column.cards.length * 30 + 110 + 'px'
  }

  function removeCard(card, column) {
    $deckStore.removeCard(card, column)
    $deckStore = $deckStore
  }
</script>

<section class="card-columns" 
  use:dndzone={{items:cardColumns, flipDurationMs, type: 'columns'}} 
  on:consider={handleDndConsiderColumns}
  on:finalize={handleDndFinalizeColumns}>
  {#each cardColumns as cardColumn(cardColumn.id) }
    <div class="column">
      <h4 class="column-title">{cardColumn.name}</h4>
      <div class="card-column" style:--columnHeight={getDeckDropListStyle(cardColumn)}
        use:dndzone={{items:cardColumn.cards, flipDurationMs}}
        on:consider={(e) => handleDndConsiderCards(cardColumn.id, e)} 
        on:finalize={(e) => handleDndFinalizeCards(cardColumn.id, e)}>
        {#each cardColumn.cards as card(card.id)}
          <div on:click={() => removeCard(card, cardColumn)} role="none" class="playing-card">
            <img src={card.imgSUrl} alt="neki"/>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</section>

<style>
  .card-columns {
    display: flex;
    margin-top: 0.5em;
  }
  .column {
    border-color: black;
    border-style: solid;
    border-width: 0.1em;
    border-top: 0;
    border-bottom: 0;
  }
  .card-column {
    height: var(--columnHeight, 100px);
    width: 150px;
  }
  .playing-card {
    height: 30px;
    text-align: center;
  }
  .column-title {
    margin-bottom: 0.2em;
    margin-top: 0.3em;
    text-align: center;
  }
</style>
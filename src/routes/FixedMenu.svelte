<script>
// @ts-nocheck

  import CardColumns from "./CardColumns.svelte";
  import { deckStore } from '../stores/deckStore';
	import { Deck } from "$lib/deck";

  export let mousePosition;

  let menuHeight = 40;

  let extendEdgeClicked = false
  let mouseExtendStartPos = 0
  let extendStartPos = 40;
  let mouseOverEdgeBool = false

  $: mousePosition, expandMenu();

  function expandMenu() {
    if (extendEdgeClicked) {
      menuHeight = extendStartPos + mouseExtendStartPos - mousePosition.y 
    }
  }
  function mouseDownEdge(e) {
    extendEdgeClicked = true
    mouseExtendStartPos = e.pageY
  }
  function mouseUpEdge(e) {
    extendEdgeClicked = false
    extendStartPos = menuHeight
  }
  function collapseFixedMenu() {
    if (menuHeight > 40) {
      menuHeight = 40;
      extendStartPos = 40;
    }
    else {
      menuHeight = 600;
      extendStartPos = 600;
    }
  }
  function focusInEdge(e) {
  }
  function focusOutEdge(e) {
    mouseUpEdge(e)
  }

  function saveDeck() {
    let text = $deckStore.toString()
    var filename = "newDeck.txt"
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
  function loadDeck() {
    $deckStore = new Deck()
  }
</script>

<div class="fixed-menu" style="--menuHeight: {menuHeight}px">
  <div role="grid" tabindex="0" class="fixed-card-edge" on:mousedown={mouseDownEdge} on:mouseup={mouseUpEdge} on:focusin={focusInEdge} on:focusout={focusOutEdge}></div>
  <div class="btns">
    <button class="save-btn" on:click={saveDeck}>Save</button>
    <button class="load-btn" on:click={loadDeck}>Load</button>
    <button class="collapse-fixed-card-btn" on:click={collapseFixedMenu}>-</button>
  </div>
  <div class="content">
    <CardColumns></CardColumns>
  </div>
</div>

<style>
  .fixed-menu {
    height: var(--menuHeight, 100px);
    position: fixed;
    width: 100%;
    bottom: 0;
    right: 0;
    background-color: grey;
    overflow: auto;
  }
  .btns {
    position: absolute;
    top: 0;
    right: inherit;
    display: flex;
    justify-content: flex-end;
  }

  .fixed-card-edge {
    position: absolute;
    top: 0;
    background-color: black;
    height: 5px;
    cursor: n-resize;
    width: 100%;
  }
</style>
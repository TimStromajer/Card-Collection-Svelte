<script>
// @ts-nocheck

  import CardColumns from "./CardColumns.svelte";
  import { deckStore } from '../stores/deckStore';
	import { Deck } from "$lib/deck";
  import { getCardByNameSet, addCardDb, addToCollection, getCollection, getCardByName } from "../database/dbService";

  export let mousePosition;

  let menuHeight = 40;

  let extendEdgeClicked = false
  let mouseExtendStartPos = 0
  let extendStartPos = 40;
  let mouseOverEdgeBool = false

  let files;

  $: mousePosition, expandMenu();

  async function fileUpload() {
    let fileText = await files[0].text()
    fileText = await fileText.split("\n")

    $deckStore = new Deck()

    for await (let row of fileText) {
      if (row.length == 0 || row.startsWith("Deck") || row.startsWith("Sideboard")) {
        continue
      }
      let tokens = row.substring(row.indexOf(" ") + 1)
      let name
      let setCode
      if (tokens.indexOf("(") > 0) {
        name = tokens.substring(0, tokens.indexOf("(") - 1)
        setCode = tokens.substring(tokens.indexOf("(")+1, tokens.indexOf(")"))
      } else {
        name = tokens.substring(" " + 1)
      }

      if (setCode) {
        await getCardByNameSet(name, setCode).then(async card => {
          if (card == null) {
            console.log(name + " does not exist")
          } else {
            $deckStore.addCard(card)
          }
        })
      } else {
        await getCardByName(name).then(async card => {
          if (card == null) {
            console.log(name + " does not exist")
          } else {
            $deckStore.addCard(card)
          }
        })
      }
      $deckStore = $deckStore
    }
  }

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
    <button class="load-btn" onclick="document.getElementById('loadBtn').click();">Load</button>
    <input id="loadBtn" type="file" bind:files on:change={fileUpload} style="display: none;">
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
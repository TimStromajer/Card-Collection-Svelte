<script>
// @ts-nocheck

  import { onMount } from "svelte";
  import CardColumns from "./CardColumns.svelte";
  import { deckStore } from '../stores/deckStore';
	import { Deck } from "$lib/deck";
  import { getCardByNameSet, getCardByName, createDeck } from "../database/dbService";
	import Dropdown from "./Dropdown.svelte";
  
  import FaFileImport from 'svelte-icons/fa/FaFileImport.svelte'
  import FaFileExport from 'svelte-icons/fa/FaFileExport.svelte'
  import IoIosCloudUpload from 'svelte-icons/io/IoIosCloudUpload.svelte'

  export let mousePosition;

  let menuHeight = 40;

  let extendEdgeClicked = false
  let mouseExtendStartPos = 0
  let extendStartPos = 40;
  let mouseOverEdgeBool = false

  let deckTitle;
  let saveDeckDialog;
  let deckCardNames = []
  let mainCard;
  let deckFormat;

  let files;

  $: mousePosition, expandMenu();

  onMount(() => {
		saveDeckDialog = document.getElementById('save-deck-dialog');
	})

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

  async function saveDeck() {
    let d = await $deckStore.postDeck(deckTitle, "slotim", deckFormat, mainCard)
    if (!deckTitle || !deckFormat || !mainCard) {
      return
    }
    let msg = await createDeck(d)
    saveDeckDialog.close()
  }
  function saveDeckInFile() {
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
  async function openSaveDeckDialog() {
    let cs = await $deckStore.getAllCards()
    cs.forEach(c => {
      deckCardNames.push(c.name)
    });
    saveDeckDialog.showModal()
  }
  function loadDeck() {
    $deckStore = new Deck()
  }
</script>

<div class="fixed-menu" style="--menuHeight: {menuHeight}px">
  <div role="grid" tabindex="0" class="fixed-card-edge" on:mousedown={mouseDownEdge} on:mouseup={mouseUpEdge} on:focusin={focusInEdge} on:focusout={focusOutEdge}></div>
  <div class="btns">
    <button class="btn-icon" on:click={() => openSaveDeckDialog()}><IoIosCloudUpload /></button>
    <button class="btn-icon" onclick="document.getElementById('loadBtn').click();"><FaFileExport /></button>
    <button class="btn-icon" on:click={() => saveDeckInFile()}><FaFileImport /></button>
    <input id="loadBtn" type="file" bind:files on:change={fileUpload} style="display: none;">
    <button class="collapse-fixed-card-btn" on:click={collapseFixedMenu}>-</button>
  </div>
  <div class="content">
    <CardColumns></CardColumns>
  </div>
</div>

<dialog class="save-deck-dialog" id="save-deck-dialog">
  <h4>Save your deck</h4>
  <div class="deck-dialog-inputs">
    <input bind:value={deckTitle} placeholder="Deck title">
    <input bind:value={deckFormat} placeholder="Format">
    <Dropdown items={deckCardNames} dropDownBtnName={mainCard != undefined && mainCard.length > 0 ? mainCard : "Title card"} bind:checked={mainCard} type="select"></Dropdown>
    <button on:click={saveDeck}>Save</button>
  </div>
</dialog>

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
  .btn-icon {
    height: 2em;
  }

  .fixed-card-edge {
    position: absolute;
    top: 0;
    background-color: black;
    height: 5px;
    cursor: n-resize;
    width: 100%;
  }
  .save-deck-dialog {
    min-width: 100px;
    min-height: 150px;
  }
  .deck-dialog-inputs {
    display: flex;
  }
</style>
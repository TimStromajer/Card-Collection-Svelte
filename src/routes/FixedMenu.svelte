<script>
// @ts-nocheck

  import { onMount } from "svelte";

  import CardColumns from "./CardColumns.svelte";
  import Dropdown from "./Dropdown.svelte";

  import { deckStore } from '../stores/deckStore';
  import { collectionUsername } from "../stores/collection";

	import { Deck } from "$lib/deck";
  import { getCardByNameSet, getCardByName, createDeck } from "../database/dbService";
  
  import FaFileImport from 'svelte-icons/fa/FaFileImport.svelte'
  import FaFileExport from 'svelte-icons/fa/FaFileExport.svelte'
  import IoIosCloudUpload from 'svelte-icons/io/IoIosCloudUpload.svelte'

  export let mousePosition;

  let innerWidth = 0
  let innerHeight = 0

  let menuHeight = 6;

  let extendEdgeClicked = false

  let deckTitle;
  let saveDeckDialog;
  let deckCardNames = []
  let mainCard;
  let deckFormat;
  let formatList = ["Brawl", "Legacy"]
  let selectedFormat;

  let username;

  let files;

  $: mousePosition, expandMenu();

  $: username = $collectionUsername

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
      menuHeight = innerHeight - mousePosition.y 
    }
  }
  function mouseDownEdge(e) {
    extendEdgeClicked = true
  }
  function mouseUpEdge(e) {
    extendEdgeClicked = false
  }
  function collapseFixedMenu() {
    if (menuHeight > 6) {
      menuHeight = 6;
    }
    else {
      menuHeight = innerHeight * 0.8;
    }
  }
  function focusInEdge(e) {
  }
  function focusOutEdge(e) {
    mouseUpEdge(e)
  }

  async function saveDeck() {
    let d = await $deckStore.postDeck(deckTitle, username, deckFormat, mainCard)
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
    deckCardNames = []
    cs.forEach(c => {
      deckCardNames.push(c.name)
    });
    saveDeckDialog.showModal()
  }
  function loadDeck() {
    $deckStore = new Deck()
  }
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="fixed-menu" style="--menuHeight: {menuHeight}px">
  <div role="none" style="--fixed-menu-width: {innerWidth < 1330? innerWidth + 1330 - innerWidth : innerWidth - 20}px" class="fixed-card-edge" on:mousedown={mouseDownEdge} on:mouseup={mouseUpEdge} on:focusin={focusInEdge} on:focusout={focusOutEdge}></div>
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
    <div class="format-dropdown">
      <Dropdown items={formatList} dropDownBtnName={selectedFormat != undefined && selectedFormat.length > 0 ? selectedFormat : "Format"} bind:checked={selectedFormat} type="select"></Dropdown>
    </div>
    <div class="mainCard-dropdown">
      <Dropdown items={deckCardNames} dropDownBtnName={mainCard != undefined && mainCard.length > 0 ? mainCard : "Title card"} bind:checked={mainCard} type="select"></Dropdown>
    </div>
  </div>
  {#if $deckStore}
    <div class="statistics">
      Your deck contains {$deckStore.getAllCards().length} cards.
    </div>
    <div>
      Approximate value: {$deckStore.price} $
    </div>
  {/if}
  <div>
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
    position: fixed;
    right: inherit;
    display: flex;
    justify-content: flex-end;

    transform: translateY(-22px);
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
    width: var(--fixed-menu-width, 100%);
  }
  .save-deck-dialog {
    min-width: 100px;
    min-height: 150px;
  }
  .deck-dialog-inputs {
    display: flex;
    margin-bottom: 1em;
  }
  .format-dropdown {
    padding-left: 0.5em;
    padding-right: 0.5em;
  }
</style>
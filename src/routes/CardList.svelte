<script>
// @ts-nocheck

  import { collection } from "../stores/collection";
  import { deckStore } from "../stores/deckStore";
  import Papa from "papaparse"
  import { getCardData } from "../api/scryfallApi";
	import Dropdown from "./Dropdown.svelte";
	import Pagination from "./Pagination.svelte";
  import { Card } from "$lib/card";

  import { getCardByNameSet, addCardDb, addToCollection, getCollection } from "../database/dbService";

  let screenSize;

  let username = "slotim"

  let cardsPerPage = 12;
  let currentPage = 0;

  let filteredCards;
  let shownCards;
  $: filteredCards = $collection

  let colorsFilter = [false, false, false, false, false];
  let colorsFilterNames = ["Black", "Green", "Red", "Blue", "White"]
  let colorsFilterValues = ["B", "G", "R", "U", "W"]
  $: colorsFilter, colorsFilterChange()

  let cmcFilter = [false, false, false, false, false, false, false];
  let cmcFilterNames = ["0", "1", "2", "3", "4", "5", "6+"]
  let cmcFilterValues = [0, 1, 2, 3, 4, 5, 6]
  $: cmcFilter, colorsFilterChange()

  let files;
  let filterText;

  // 1330, 1170, 1005, 840, 690, 530, 365
  $: screenSize, screenSizeChange()

  function screenSizeChange() {
    if (screenSize >=  1495) {
      cardsPerPage = 18
    } else if (screenSize >=  1330) {
      cardsPerPage = 16
    } else if (screenSize >= 1170) {
      cardsPerPage = 14
    } else if (screenSize >= 1005) {
      cardsPerPage = 12
    } else if (screenSize >= 840) {
      cardsPerPage = 10
    } else if (screenSize >= 690) {
      cardsPerPage = 8
    } else if (screenSize >= 530) {
      cardsPerPage = 6
    }
  }

  function addCard(card) {
    $deckStore.addCard(card)
    $deckStore = $deckStore
  }

  async function readFile() {
    let csvString = await files[0].text()
    let data = await parseCSV(csvString)
    let cardIds = []
    let index = 1
    for await (let row of data) {
      console.log("working on card " + index + "/" + data.length)
      index += 1
      let amount = row[1]
      let name = row[3]
      let setCode = row[4]
      if (!name || !setCode) continue
      if (setCode.length == 4 && setCode[0] == "V") setCode = setCode.substring(1)
      // check db for card info
      await getCardByNameSet(name, setCode).then(async card => {
        // get data from scryfall
        if (card == null) {
          await getCardData(name, setCode).then(async cardScry => {
            if (cardScry.name == "Error") {
              console.log(cardScry.message)
            } else {
              for (let i = 0; i<amount; i++) {
                cardIds.push(cardScry.scryfallId)
              }
              await addCardDb(cardScry)
              //addCardToCollection(cardScry)
            }
          })
        } else {
          for (let i = 0; i<amount; i++) {
            cardIds.push(card.scryfallId)
          }
        }
      })
    };
    await addToCollection(username, cardIds)
    resetCol(username)
  }

  export function resetCol(username) {
    $collection = []
    var itemsProcessed = 0;
    getCollection(username).then(col => {
      if (col) {
        col.forEach(item => {
          let card = item.cardInfo
          $collection.push(new Card(card.name, card.setCode, card.collectorCode, card.printing,
            card.scryfallId, card.price, card.imgSUrl,
            card.imgNUrl, card.imgLUrl, card.colorIdentity, card.cmc, card.manaCost, card.rarity, card.typeLine, card.oracleText, item.amount))
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

  async function parseCSV(csvString) {
    var read = await Papa.parse(csvString);
    if (read.errors.length > 0) {
      return
    }
    let csv = read.data
    if (csv[0].length == 1) {
      csv.shift()
    }
    csv.shift()
    return csv;
  }

  function textFilterChange() {
    filterCollection()
  }

  function colorsFilterChange() {
    if (!$collection) return
    filterCollection()
  }

  async function filterCollection() {
    let colorNum = 0
    let cmcNum = 0
    colorsFilter.forEach(f => {if (f) colorNum += 1})
    cmcFilter.forEach(f => {if (f) cmcNum += 1})
    filteredCards = await $collection.filter(card => {
      if (filterText != null && filterText.length > 0 &&
          !card.name.toLowerCase().includes(filterText.toLowerCase()) &&
          !card.typeLine.toLowerCase().includes(filterText.toLowerCase()) &&
          (!card.oracleText || !card.oracleText.toLowerCase().includes(filterText.toLowerCase()))) {
        return false
      } else {
        let colorArr = new Array;
        card.colorIdentity.forEach((color) => {
          if (colorsFilter[colorsFilterValues.indexOf(color)]) colorArr.push(colorsFilter[colorsFilterValues.indexOf(color)])
        })
        if (colorNum > 0 && colorArr.length < colorNum) {
          return false;
        } else {
          let isCmcFiltered = cmcFilter[cmcFilterValues.indexOf(card.cmc)]
          if (cmcNum > 0 && (isCmcFiltered == false || isCmcFiltered == undefined && cmcFilter[6] == false)) {
            return false;
          } else {
            return true
          }
        }
      }
    })
    currentPage = 0;
    shownCards = filteredCards.slice(0, cardsPerPage)
  }

  function onPageChange(event) {
    let newPage = event.detail.page
    shownCards = filteredCards.slice(newPage * cardsPerPage, newPage * cardsPerPage + cardsPerPage)
  }
</script>

<svelte:window bind:innerWidth={screenSize} />

<input class="filter-text" bind:value={filterText} placeholder="filter by text" on:keyup={() => textFilterChange()} />
<Dropdown items={colorsFilterNames} dropDownBtnName="Colors" bind:checked={colorsFilter} type="checkbox"></Dropdown>
<Dropdown items={cmcFilterNames} dropDownBtnName="CMC" bind:checked={cmcFilter} type="checkbox"></Dropdown>

{#if !shownCards}
  <div>Loading...</div>
{:else}
  <div class="card-list">
    {#each shownCards as card}
      <div class="card">
        <button class="add-card-btn" on:click={() => addCard(card)}>
          <img src="{card.imgSUrl}" alt="{card.name}"/>
          <div>{card.amount}</div>
        </button>
      </div>
    {/each}
  </div>
{/if}

<Pagination pageSize={cardsPerPage} count={filteredCards.length} on:pageChange={onPageChange} bind:page={currentPage}></Pagination>

<span>Upload cards to the collection: </span>
<input type="file" bind:files class="input-files" disabled>
{#if files && files[0]}
  <button on:click={() => readFile()}>Upload</button>
{/if}

<style>
  .card-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .card {
    height: 13em;
    width: auto;
    margin-left: 0.5em;
    margin-right: 0.5em;
    margin-bottom: 1.4em;
  }
  img {
    width: 100%;
    border-radius: 0.6em;
    border: 1px solid black;
    aspect-ratio: 2.5 / 3.5;
  }
  .add-card-btn {
    padding: 0;
    margin: 0;
    border: 0;
    height: 95%;
    border-radius: 1em;
    cursor: copy;
  }
  .filter-text {
    margin: 0.5em;
  }
  .input-files {
    margin-top: 16px;
  }
</style>
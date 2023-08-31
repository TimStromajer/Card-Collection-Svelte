<script>
// @ts-nocheck

  import { onMount } from "svelte";
  import Papa from "papaparse"

  import { Card } from "$lib/card";
  import { parseFile } from "$lib/fileParser";

  import { collection, collectionUsername } from "../../../stores/collection";
  import { deckStore } from "../../../stores/deckStore";

  import { getCardData, getCardsDataCN } from "../../../api/scryfallApi";
	import Dropdown from "../../Dropdown.svelte";
	import Pagination from "../../Pagination.svelte";
  import BigCard from "./BigCard.svelte";

  import { getCardsByCnSetCodePair, getCardByCollectorNumberSet, addToCollection, getCollection, addCardDb, addCardsDb } from "../../../database/dbService";
  import { collectionData } from "../../../database/database";

  export let username;

  let message = "Loading...";

  let screenSize;

  let hoverCard;
  let showBigCard;

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
  $: cmcFilter, cmcFilterChange()

  let rarityFilter;
  let rarityFilterNames = ["Common", "Uncommon", "Rare", "Mythic"]
  let rarityFilterValues = ["C", "U", "R", "M"]
  $: rarityFilter, raratyFilterChange()

  let files;
  let filterText;

  // 1825, 1660, 1495, 1330, 1170, 1005, 840, 690, 530, 365
  $: screenSize, screenSizeChange()

  onMount(async () => {

    if (!$collection || $collectionUsername != username) {
      $collectionUsername = username
      $collection = []
      resetCol(username)
    } else if ($collection.length == 0) {
      message = "This collection has no cards. Upload some!"
    } else if ($collection && $collectionUsername == username) {
      await filterCollection()
      message = ""
    }

  });

  function screenSizeChange() {
    if (screenSize >=  1825) {
      cardsPerPage = 22
    } else if (screenSize >=  1660) {
      cardsPerPage = 20
    } else if (screenSize >=  1495) {
      cardsPerPage = 18
    } else if (screenSize >=  1330) {
      cardsPerPage = 16
    } else if (screenSize >= 1180) {
      cardsPerPage = 14
    } else if (screenSize >= 1015) {
      cardsPerPage = 12
    } else if (screenSize >= 855) {
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
    let data = await parseFile(csvString)
    let cardIds = []
    let index = 1
    for await (let row of data) {
      console.log("working on card " + index + "/" + data.length)
      index += 1
      // check db for card info
      await getCardByCollectorNumberSet(row.cn, row.setCode).then(async card => {
        // get data from scryfall
        if (card == null) {
          await getCardsDataCN(row.cn, row.setCode, row.printing).then(async cardScry => {
            if (cardScry.name == "Error") {
              console.log(cardScry.message)
            } else {
              for (let i = 0; i<amount; i++) {
                cardIds.push(cardScry.scryfallId)
              }
              await addCardDb(cardScry)
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

  async function readFileFast() {
    let csvString = await files[0].text()
    let data = await parseFile(csvString)
    let cnSetPairs = []
    for await (let row of data) {
      cnSetPairs.push({"collectorCode": row["cn"], "setCode": row["setCode"]})
    }
    console.log("Read " + cnSetPairs.length + " rows.")
    let foundCards = []
    let notFoundCards = []
    let cardIds = []
    await getCardsByCnSetCodePair(cnSetPairs).then(ownedCards => {
      foundCards = ownedCards
      data.forEach(async d => {
        let found = false;
        await ownedCards.forEach(owned => {
          if (d.setCode == owned.setCode && d.collectorCode == owned.collectorCode) {
            for (let i = 0; i<d.amount; i++) {
              cardIds.push(owned.scryfallId)
            }
            found = true
          }
        })
        if (!found) {
          notFoundCards.push(d)
        }
      })
    })
    console.log(foundCards.length + "/" + (foundCards.length + notFoundCards.length) + " cards already in database. Gathering the rest.")
    let count = 0
    let cardsInfo = []
    await notFoundCards.forEach(async notFound => {
      await getCardsDataCN(notFound.cn, notFound.setCode, notFound.printing).then(async cardScry => {
        if (cardScry.name == "Error") {
          console.log(cardScry.message)
        } else {
          for (let i = 0; i<notFound.amount; i++) {
            cardIds.push(cardScry.scryfallId)
          }
          cardsInfo.push(cardScry)
        }
      })
      count += 1
      console.log(count + "/" + notFoundCards.length)
      if (count == notFoundCards.length) {
        await addCardsDb(cardsInfo)
        await addToCollection(username, cardIds)
        resetCol(username)
      }
    })
    if (notFoundCards.length == 0) {
      console.log("Adding everything to collection.")
      await addToCollection(username, cardIds)
      resetCol(username)
    }
  }

  async function resetCol(username) {
    $collection = []
    var itemsProcessed = 0;
    message = "Loading..."
    getCollection(username).then(col => {
      if (!col || col.length == 0) {
        message = "This collection has no cards. Upload some!"
      }
      else if (col) {
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
        message = ""
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
      // sort alpabetically
      else {
        return a.name.localeCompare(b.name)
      }
    })
  }

  function textFilterChange() {
    filterCollection()
  }

  function cmcFilterChange() {
    if (!$collection) return
    filterCollection()
  }

  function colorsFilterChange() {
    if (!$collection) return
    filterCollection()
  }

  function raratyFilterChange() {
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
            if (rarityFilter != null && rarityFilter.length > 0 && card.rarity.toLowerCase() != rarityFilter.toLowerCase()) {
              return false
            } else {
              return true
            }
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

  function mouseEnterCard(card) {
    setTimeout(showBiggerCard, 1000, card);
    hoverCard = card
  }
  function mouseLeaveCard(card) {
    hoverCard = null
    showBigCard = false
  }
  function showBiggerCard(card) {
    if (hoverCard && card.scryfallId == hoverCard.scryfallId) {
      showBigCard = true
    } else {
    }
  }
</script>

<svelte:window bind:innerWidth={screenSize} />

<div class="filters">
  <input class="filter-item" bind:value={filterText} placeholder="filter by text" on:keyup={() => textFilterChange()} />
  <div class="filter-item">
    <Dropdown items={colorsFilterNames} dropDownBtnName="Colors" bind:checked={colorsFilter} type="checkbox"></Dropdown>
  </div>
  <div class="filter-item">
    <Dropdown items={cmcFilterNames} dropDownBtnName="CMC" bind:checked={cmcFilter} type="checkbox"></Dropdown>
  </div>
  <div class="filter-item">
    <Dropdown items={rarityFilterNames} dropDownBtnName="Rarity" bind:checked={rarityFilter} type="select"></Dropdown>
  </div>
</div>

{#if message && message.length > 0}
  <p>{message}</p>
{:else}
  <div class="card-list">
    {#each shownCards as card}
      <div class="card">
        <button class="add-card-btn" on:click={() => addCard(card)}>
          <img src="{card.imgNUsrl}" alt="{card.name}" on:mouseenter={() => mouseEnterCard(card)} on:mouseleave={() => mouseLeaveCard(card)}/>
          <div>{card.amount}</div>
        </button>
      </div>
    {/each}
  </div>
{/if}

<Pagination pageSize={cardsPerPage} count={filteredCards.length} on:pageChange={onPageChange} bind:page={currentPage}></Pagination>

<span>Upload cards to the collection: </span>
<input type="file" bind:files class="input-files">
{#if files && files[0]}
  <button on:click={() => readFileFast()}>Upload</button>
{/if}

{#if showBigCard}
  <BigCard card={hoverCard}></BigCard>
{/if}

<style>
  .card-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .card {
    height: 13em;
    width: 148px;
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
  .filters {
    margin: 0.5em;
    display: flex;
    flex-wrap: wrap;
  }
  .filter-item {
    margin: 0.2em;
  }
  .input-files {
    margin-top: 16px;
  }
</style>
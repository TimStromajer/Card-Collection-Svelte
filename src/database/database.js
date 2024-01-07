// @ts-nocheck
import * as neo4j from 'neo4j-driver'
import { Card } from '$lib/card';

import { getCollection } from './dbService';

export function resetCollection(username) {
  let collection = []
  getCollection(username).then(col => {
    if (col) {
      for (let card of col.cards) {
        collection.push(new Card(card.name, "SET", 33, "Normal", 1, 1.0, card.imgSUrl,
          null, null, ["U"], 3, "A", "R", "C", "Flying powe is"))
      }
      return collection
    }
  })
}

export let collectionData = [
  // new Card("Haughty Djinn", "SET", 33, "Normal", 1, 1.0, "https://cards.scryfall.io/small/front/3/5/35095a68-b7c0-4805-b0b6-6ca15a338692.jpg?1673306736",
  // "https://cards.scryfall.io/normal/front/3/5/35095a68-b7c0-4805-b0b6-6ca15a338692.jpg?1673306736",
  // "https://cards.scryfall.io/large/front/3/5/35095a68-b7c0-4805-b0b6-6ca15a338692.jpg?1673306736", ["U"], 3, "A", "R", "C", "Flying powe is"),
  // new Card("General Kudro", "SET", 33, "Normal", 2, 1.0, "https://cards.scryfall.io/small/front/2/c/2c3227ae-0c72-478a-a6dd-661aaf718038.jpg?1591228027",
  // "https://cards.scryfall.io/normal/front/4/7/478645dc-4d84-4e9e-9535-c6ef28b52897.jpg?1645624897", 
  // "https://cards.scryfall.io/large/front/4/7/478645dc-4d84-4e9e-9535-c6ef28b52897.jpg?1645624897", ["B", "W"], 3, "A", "R", "C", "text"),
  // new Card("Gandalf the Grey", "SET", 33, "Normal", 3, 1.0, "https://cards.scryfall.io/small/front/e/2/e2b975e6-e709-481f-bfbc-41a832508283.jpg?1686969808",
  // null, null, ["R", "U"], 3, "A", "R", "C", "text"),
  // new Card("Master of Arms", "SET", 33, "Normal", 4, 1.0, "https://cards.scryfall.io/small/front/a/c/ac97ff43-c0b6-4f67-ad09-5ba8710c681a.jpg?1562802672",
  // null, null, ["R", "U"], 3, "A", "R", "C", "text"),

  // new Card("Master of Arms", "SET", 33, "Normal", 5, 1.0, "https://cards.scryfall.io/small/front/a/c/ac97ff43-c0b6-4f67-ad09-5ba8710c681a.jpg?1562802672",
  // null, null, ["R", "U"], 3, "A", "R", "C", "text"),
  // new Card("Master of Arms", "SET", 33, "Normal", 6, 1.0, "https://cards.scryfall.io/small/front/a/c/ac97ff43-c0b6-4f67-ad09-5ba8710c681a.jpg?1562802672",
  // null, null, ["R", "U"], 3, "A", "R", "C", "text"),
  // new Card("Master of Arms", "SET", 33, "Normal", 7, 1.0, "https://cards.scryfall.io/small/front/a/c/ac97ff43-c0b6-4f67-ad09-5ba8710c681a.jpg?1562802672",
  // null, null, ["R", "U"], 3, "A", "R", "C", "text"),
  // new Card("Master of Arms", "SET", 33, "Normal", 8, 1.0, "https://cards.scryfall.io/small/front/a/c/ac97ff43-c0b6-4f67-ad09-5ba8710c681a.jpg?1562802672",
  // null, null, ["R", "U"], 3, "A", "R", "C", "text"),
  // new Card("Master of Arms", "SET", 33, "Normal", 9, 1.0, "https://cards.scryfall.io/small/front/a/c/ac97ff43-c0b6-4f67-ad09-5ba8710c681a.jpg?1562802672",
  // null, null, ["R", "U"], 3, "A", "R", "C", "text"),
  // new Card("Master of Arms", "SET", 33, "Normal", 10, 1.0, "https://cards.scryfall.io/small/front/a/c/ac97ff43-c0b6-4f67-ad09-5ba8710c681a.jpg?1562802672",
  // null, null, ["R", "U"], 3, "A", "R", "C", "text"),
  // new Card("Master of Arms", "SET", 33, "Normal", 11, 1.0, "https://cards.scryfall.io/small/front/a/c/ac97ff43-c0b6-4f67-ad09-5ba8710c681a.jpg?1562802672",
  // null, null, ["R", "U"], 3, "A", "R", "C", "text"),
  // new Card("Master of Arms", "SET", 33, "Normal", 12, 1.0, "https://cards.scryfall.io/small/front/a/c/ac97ff43-c0b6-4f67-ad09-5ba8710c681a.jpg?1562802672",
  // null, null, ["R", "U"], 3, "A", "R", "C", "text"),
  // new Card("Master of Arms", "SET", 33, "Normal", 13, 1.0, "https://cards.scryfall.io/small/front/a/c/ac97ff43-c0b6-4f67-ad09-5ba8710c681a.jpg?1562802672",
  // null, null, ["R", "U"], 3, "A", "R", "C", "text")
]

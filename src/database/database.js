// @ts-nocheck
import * as neo4j from 'neo4j-driver'
import { Card } from '$lib/card';

import { getCollection } from './dbService';

// export let conn = (async () => {
//   // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
//   const URI = 'neo4j+s://da430251.databases.neo4j.io'
//   const USER = 'neo4j'
//   const PASSWORD = '9TtyBFbKfNAfIwi5tL27qw_T7Phn5zb5r5GVWt4Qztk'
//   let driver

//   try {
//     console.log("--------------------")
//     driver = neo4j.Driver(URI,  neo4j.auth.basic(USER, PASSWORD))
//     const serverInfo = await driver.getServerInfo()
//     console.log('Connection established')
//     console.log(serverInfo)
//   } catch(err) {
//     console.log(`Connection error\n${err}\nCause: ${err.cause}`)
//   }
// })();

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
  // null, null, ["U"], 3, "A", "R", "C", "Flying powe is"),
  // new Card("General Kudro", "SET", 33, "Normal", 2, 1.0, "https://cards.scryfall.io/small/front/2/c/2c3227ae-0c72-478a-a6dd-661aaf718038.jpg?1591228027",
  // null, null, ["B", "W"], 3, "A", "R", "C", "text"),
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
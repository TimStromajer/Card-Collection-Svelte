// @ts-nocheck
import { Card } from "./card";

export class Deck {
  fields;
  cardIdCounter;

  initialFieldNames = ["lands", "0", "1", "2", "3", "4", "5", "6+", "Sideboard"];

  constructor() {
    this.cardIdCounter = 0;
    this.fields = []
    for (let i = 0; i < this.initialFieldNames.length; i++) {
      this.fields.push(new Field(i, this.initialFieldNames[i], []))
    }
  }

  addCard(_card) {
    let card = Object.assign({}, _card)
    card.id = this.cardIdCounter;
    this.cardIdCounter += 1;
    if (card["typeLine"] == "Land") {
      this.fields[0].cards.push(card)
    } else if (card["cmc"] < 7) {
      this.fields[card["cmc"] + 1].cards.push(card)
    } else {
      this.fields[-1].cards.push(card)
    }
  }

  removeCard(card, column) {
    let field = this.fields.find(f => f.id == column.id)
    let cardIndex = field.cards.findIndex(c => c.id == card.id)
    this.fields[field.id].cards.splice(cardIndex, 1)
  }

  toString() {
    let deckText = "Deck\r\n"
    let sideboard;
    this.fields.forEach(field => {
      if (field.name != "Sideboard") {
        field.cards.forEach(card => {
          deckText += card.amount + " " + card.name + " (" + card.setCode + ")\r\n"
        })
      } else {
        sideboard = field
      }
    })
    if (sideboard.cards.length > 0) {
      deckText += "\r\nSideboard\r\n"
      sideboard.cards.forEach(card => {
        deckText += card.amount + " " + card.name + " (" + card.setCode + ")\r\n"
      })
    }
    return deckText;
  }
}

class Field {
  id;
  name;
  cards;
  constructor(id, name, cards) {
    this.id = id;
    this.name = name;
    this.cards = cards;
  }
}
// @ts-nocheck

export class Deck {
  fields;
  cardIdCounter;
  price = 0;

  initialFieldNames = ["lands", "0", "1", "2", "3", "4", "5", "6+", "Sideboard"];

  constructor() {
    this.cardIdCounter = 0;
    this.fields = []
    for (let i = 0; i < this.initialFieldNames.length; i++) {
      this.fields.push(new Field(i, this.initialFieldNames[i], []))
    }
  }

  calculatePrice() {
    this.price = 0
    this.fields.forEach(f => {
      f.cards.forEach(c => {
        if (c.price != null) {
          this.price += parseFloat(c.price) 
        }
      })
    })
  }

  addCard(_card) {
    let card = Object.assign({}, _card)
    card.id = this.cardIdCounter;
    this.cardIdCounter += 1;
    if (card["typeLine"].startsWith("Land")) {
      this.fields[0].cards.push(card)
    } else if (card["cmc"] < 7) {
      this.fields[card["cmc"] + 1].cards.push(card)
    } else {
      this.fields[this.fields.length-2].cards.push(card)
    }

    if (card.price != null) {
      this.price += parseFloat(card.price) 
    }
  }

  removeCard(card, column) {
    let field = this.fields.find(f => f.id == column.id)
    let cardIndex = field.cards.findIndex(c => c.id == card.id)
    this.fields[field.id].cards.splice(cardIndex, 1)

    if (card.price != null) {
      this.price -= parseFloat(card.price) 
    }
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

  postDeck(title, username, type, mainCard) {
    let mC;
    let allCards = []
    this.fields.forEach(f => {
      f.cards.forEach(c => {
        if (c.name == mainCard) {
          mC = c.imgNUsrl
        }
        allCards.push(c.scryfallId)
      })
    })
    let postDeck = new PostDeck(title, username, allCards, type, mC)
    return postDeck
  }

  getAllCards() {
    let allCards = []
    this.fields.forEach(f => {
      f.cards.forEach(c => {
        allCards.push(c)
      })
    })
    return allCards
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

class PostDeck {
  title
  username
  cards
  type
  mainCard
  constructor(title, username, cards, type, mainCard) {
    this.title = title;
    this.username = username;
    this.cards = cards;
    this.type = type;
    this.mainCard = mainCard;
  }
}
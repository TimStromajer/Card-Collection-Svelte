// @ts-nocheck
import {PUBLIC_FUNCTIONS_URL} from "$env/static/public"

//
// USERS // ----------------------------------------------------------------------
//

export function getUsers() {
    let url = PUBLIC_FUNCTIONS_URL + "/users"
    return fetch(url, {
            mode: "cors"
        })
        .then(response => response.json())
        .then(data => {
            return data
        })
}

export function getUser(username) {
    let url = PUBLIC_FUNCTIONS_URL + "/users?username=" + username
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
}

export function addUser(username) {
    let url = PUBLIC_FUNCTIONS_URL + "/users"
    return fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"username": username})
        })
        .then(response => response.json())
        .then(data => {
            return data
        })
}

//
// CARDS // ----------------------------------------------------------------------
//

export function getCardByNameSet(name, setCode) {
    let cardName = name.replaceAll(" ", '+')
    cardName = cardName.replaceAll(",", '%2C')
    cardName = cardName.replaceAll("'", '%27')
    let url = PUBLIC_FUNCTIONS_URL + "/cards?name=" + name + "&setCode=" + setCode
    return fetch(url, {
            mode: "cors"
        })
        .then(response => response.json())
        .then(data => {
            return data
        })
}

export function getCardByCollectorNumberSet(collectorNumber, setCode) {
    let url = PUBLIC_FUNCTIONS_URL + "/cards?collectorNumber=" + collectorNumber + "&setCode=" + setCode
    return fetch(url, {
            mode: "cors"
        })
        .then(response => response.json())
        .then(data => {
            return data
        })
}

export function getCardByName(name) {
    let cardName = name.replaceAll(" ", '+')
    cardName = cardName.replaceAll(",", '%2C')
    cardName = cardName.replaceAll("'", '%27')
    let url = PUBLIC_FUNCTIONS_URL + "/cards?name=" + name
    return fetch(url, {mode: "cors"})
        .then(response => response.json())
        .then(data => {
            return data
        })
}

export function getCardByScryfallId(scryfallId) {
    let url = PUBLIC_FUNCTIONS_URL + "/cards?scryfallId=" + scryfallId
        return fetch(url, {
                mode: "cors"
            })
        .then(response => response.json())
        .then(data => {
            return data
        })
}

export function getCardsByCnSetCodePair(pairs) {
    let url = PUBLIC_FUNCTIONS_URL + "/cards"
    return fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"cnSetCodePairs": pairs})
        })
        .then(response => response.json())
        .then(data => {
            return data
        })
}

export function getCardsByNameSetCodePair(pairs) {
    let url = PUBLIC_FUNCTIONS_URL + "/cards"
    return fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"nameSetCodePairs": pairs})
        })
        .then(response => response.json())
        .then(data => {
            return data
        })
}

export function addCardDb(card) {
    let url = PUBLIC_FUNCTIONS_URL + "/cards"
    return fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(card)
        })
        .then(response => response.json())
        .then(data => {
            return data
        })
}

export function addCardsDb(cards) {
    let url = PUBLIC_FUNCTIONS_URL + "/cards"
    return fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"cards": cards})
        })
        .then(response => response.json())
        .then(data => {
            return data
        })
}

//
// COLLECTION // ----------------------------------------------------------------------
//

export function getCollection(username) {
    let url = PUBLIC_FUNCTIONS_URL + "/collection?username=" + username
    return fetch(url, {mode: "cors"})
        .then(response => response.json())
        .then(data => {
            return data
        })
}

export function addToCollection(username, cards) {
    //if (username == "slotim") return "nope"
    let url = PUBLIC_FUNCTIONS_URL + "/collection"
    return fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"username": username, "cards": cards})
        })
        .then(response => response.json())
        .then(data => {
            return data
        })
}

//
// DECK // ----------------------------------------------------------------------
//

export function getDecks(username) {
    let url = PUBLIC_FUNCTIONS_URL + "/decks"
    return fetch(url, {mode: "cors"})
        .then(response => response.json())
        .then(data => {
            return data
        })
}

export function getDeck(username, title) {
    let url = PUBLIC_FUNCTIONS_URL + "/decks?username=" + username + "&title=" + title
    return fetch(url, {mode: "cors"})
        .then(response => response.json())
        .then(data => {
            return data
        })
} 

export function createDeck(postDeck) {
    let url = PUBLIC_FUNCTIONS_URL + "/decks"
    return fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(postDeck)
        })
        .then(response => response.json())
        .then(data => {
            return data
        })
}

export function deleteDeck(username, title) {
    if (username == "slotim") return "nope"
    let url = PUBLIC_FUNCTIONS_URL + "/decks?username=" + username + "&title=" + title
    return fetch(url, {method: "DELETE", mode: "cors"})
        .then(response => response.json())
        .then(data => {
            return data
        })
}
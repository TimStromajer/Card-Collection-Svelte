// @ts-nocheck
import {PUBLIC_FUNCTIONS_URL} from "$env/static/public"

//
// USERS // ----------------------------------------------------------------------
//
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
            headers: {"Content-Type": "application/json"},
            body: {"username": username}
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
}

//
// CARDS // ----------------------------------------------------------------------
//

export function getCardByNameSet(name, setCode) {
    let url = PUBLIC_FUNCTIONS_URL + "/cards?name=" + name + "&setCode=" + setCode
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
}

export function getCardByScryfallId(scryfallId) {
    let url = PUBLIC_FUNCTIONS_URL + "/cards?scryfallId=" + scryfallId
        return fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
}

export function addCard(card) {
    let url = PUBLIC_FUNCTIONS_URL + "/cards"
    return fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: card
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
}

//
// COLLECTION // ----------------------------------------------------------------------
//

export function getCollection(username) {
    let url = PUBLIC_FUNCTIONS_URL + "/collection?username=" + username
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
}

export function addToCollection(username, cards) {
    let url = PUBLIC_FUNCTIONS_URL + "/collection"
    return fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: {"username": username, "cards": cards}
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
}
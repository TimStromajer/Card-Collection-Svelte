// @ts-nocheck
import {PUBLIC_FUNCTIONS_URL} from "$env/static/public"

export function getUser(username) {
    let url = PUBLIC_FUNCTIONS_URL + "/users?username=" + username
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
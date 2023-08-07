// @ts-nocheck
import { Card } from "$lib/card"

export function getCardData(cardNameOrig, setCode) {
  cardName = cardNameOrig.replaceAll(" ", '+')
  cardName = cardName.replaceAll(",", '%2C')
  cardName = cardName.replaceAll("'", '%27')
  let url = "https://api.scryfall.com/cards/named?exact=" + cardName
  if (setCode != null) {
    url += "&set=" + setCode
  }

  return fetch(url)
  .then(response => response.json())
  .then(data => {
    if (data["object"] == "error") {
      throw new Error("Could not find the card: '" + cardNameOrig + "' in set " + setCode)
    }
    if (data["layout"] == "modal_dfc" || data["layout"] == "transform") {
      return new Card(data["name"], data["set"], data["collector_number"], null, data["id"], data["prices"]["usd"],
      data["card_faces"][0]["image_uris"]["small"], data["card_faces"][0]["image_uris"]["normal"], data["card_faces"][0]["image_uris"]["large"], data["color_identity"], 
      data["cmc"], data["card_faces"][0]["mana_cost"] + " // " + data["card_faces"][1]["mana_cost"], data["rarity"], data["type_line"], 
      data["card_faces"][0]["oracle_text"] + " " + data["card_faces"][1]["oracle_text"])
    } else if (data["layout"] == "split" || data["layout"] == "adventure") {
      return new Card(data["name"], data["set"], data["collector_number"], null, data["id"], data["prices"]["usd"],
      data["image_uris"]["small"], data["image_uris"]["normal"], data["image_uris"]["large"], data["color_identity"], 
      data["cmc"], data["mana_cost"], data["rarity"], data["type_line"], 
      data["card_faces"][0]["oracle_text"] + " " + data["card_faces"][1]["oracle_text"])
    } else {
      return new Card(data["name"], data["set"], data["collector_number"], null, data["id"], data["prices"]["usd"],
      data["image_uris"]["small"], data["image_uris"]["normal"], data["image_uris"]["large"], data["color_identity"], 
      data["cmc"], data["manaCost"], data["rarity"], data["type_line"], 
      data["oracle_text"])
    }
  }).catch(error => {
    return error;
  });
}
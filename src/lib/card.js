// @ts-nocheck
export class Card {
  name;
  setCode;
  collectorCode;
  printing;

  scryfallId;
  price;
  imgSUrl;
  imgNUsrl;
  imgLUrl;
  colorIdentity;
  cmc;
  manaCost;
  rarity;
  typeLine;
  oracleText;

  amount;
  id;

  constructor(name, setCode, collectorCode, printing, scryfallId, price, imgSUrl, imgNUsrl, imgLUrl, colorIdentity, cmc, manaCost, rarity, typeLine, oracleText, amount=1) {
    this.name = name;
    this.setCode = setCode;
    this.collectorCode = collectorCode;
    this.printing = printing;
    this.scryfallId = scryfallId;
    this.price = price;
    this.imgSUrl = imgSUrl;
    this.imgNUsrl = imgNUsrl;
    this.imgLUrl = imgLUrl;
    this.colorIdentity = colorIdentity;
    this.cmc = cmc;
    this.manaCost = manaCost;
    this.rarity = rarity;
    this.typeLine = typeLine;
    this.oracleText = oracleText;
    this.amount = amount;
  }
}
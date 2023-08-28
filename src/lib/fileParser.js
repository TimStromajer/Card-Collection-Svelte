// @ts-nocheck
import Papa from "papaparse"

export function parseFile(fileString) {
    if (fileString.startsWith("\"sep=,\"")) {
        return parseCSV(fileString)
    } else {
        return parseDeckText(fileString)
    }
}

async function parseDeckText(deckString) {
    let rows = deckString.split("\n")
    rows = rows.slice(1)
    let cards = []
    rows.forEach(async card => {
        if (card.length > 1 && !card.startsWith("Sideboard")) {
            let info = await parseDeckRow(card)
            if (info) await cards.push(info)
        }
    });
    return cards
}

function parseDeckRow(row) {
    if (row.length == 0 || row.startsWith("Deck") || row.startsWith("Sideboard")) {
        return null
    }
    row = row.replace("\r", "")
    let amount = row.split(" ")[0]
    let tokens = row.substring(row.indexOf(" ") + 1)
    let name
    let setCode
    let cn
    if (tokens.indexOf("(") > 0) {
        name = tokens.substring(0, tokens.indexOf("(") - 1)
        setCode = tokens.substring(tokens.indexOf("(")+1, tokens.indexOf(")"))
        cn = tokens.substring(tokens.indexOf(")")+2, tokens.length)
    } else {
        name = tokens.substring(" " + 1)
    }

    return {"amount": amount, "name": name, "setCode": setCode.toLowerCase(), "cn": cn, "printing": "Normal"}
}

async function parseCSV(csvString) {
    var read = await Papa.parse(csvString);
    if (read.errors.length > 0) {
      return
    }
    let csv = read.data
    if (csv[0].length == 1) {
      csv.shift()
    }
    csv.shift()
    let cards = []
    for await (let row of csv) {
        let info = await parseCSVRow(row)
        if (info) cards.push(info)
    }
    return cards;
}

function parseCSVRow(row) {
    let amount = row[1]
    let name = row[3]
    let setCode = row[4]
    let collectorNumber = row[6]
    let printing = row[8]
    if (!name || !setCode) return null
    if (setCode.length == 4 && setCode[0] == "V") setCode = setCode.substring(1)
    return {"amount": amount, "name": name, "setCode": setCode.toLowerCase(), "cn": collectorNumber, "printing": printing}
}
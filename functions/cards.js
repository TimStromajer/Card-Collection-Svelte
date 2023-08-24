import { MongoClient } from "mongodb";

const uri = "mongodb+srv://slotim:Geslo123@cluster0.w0milto.mongodb.net/?retryWrites=true&w=majority";
const mongoClient = new MongoClient(uri);

export async function handler(event, context) {
  // GET CARDS
  if (event.httpMethod == "GET") {
    const clientPromise = await mongoClient.connect();
    try {
      const database = (await clientPromise).db("Card-Collection-Svelte");
      const collection = database.collection("cards");
      // if looking by scryfall id
      if (event.queryStringParameters.scryfallId != null) {
        const cursor = await collection.findOne({scryfallId: event.queryStringParameters.scryfallId})
        var card = await cursor;
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
          },
          body: JSON.stringify(card)
        }
      }
      // if looking by name and set code
      else if (event.queryStringParameters.name != null && event.queryStringParameters.setCode != null) {
        const cursor = await collection.findOne({name: {$regex: event.queryStringParameters.name+".*"}, setCode: event.queryStringParameters.setCode.toLowerCase()})
        var card = await cursor;
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
          },
          body: JSON.stringify(card)
        }
      }
      // if looking by collector number and set code
      else if (event.queryStringParameters.collectorNumber != null && event.queryStringParameters.setCode != null) {
        const cursor = await collection.findOne({collectorCode: event.queryStringParameters.collectorNumber, setCode: event.queryStringParameters.setCode.toLowerCase()})
        var card = await cursor;
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
          },
          body: JSON.stringify(card)
        }
      }
      // if looking by only name
      else if (event.queryStringParameters.name != null) {
        const cursor = await collection.findOne({name: {$regex: event.queryStringParameters.name+".*"}})
        var card = await cursor;
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
          },
          body: JSON.stringify(card)
        }
      }
    } catch (error) {
      return { statusCode: 501, body: error.toString() }
    } finally {
      (await clientPromise).close()
    }
  // POST CARD
  } else if (event.httpMethod == "POST") {
    const clientPromise = await mongoClient.connect();
    let reqData = JSON.parse(event.body)
    console.log(reqData)
    try {
      const database = (await clientPromise).db("Card-Collection-Svelte");
      const collection = await database.collection("cards");
      // if posting cards by scryfallId
      if (reqData.scryfallId != null) {
        var exists = await collection.findOne({scryfallId: reqData.scryfallId})
        if (exists == null) {
          await collection.insertOne(reqData)
          return {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "*",
              "Access-Control-Allow-Methods": "*"
            },
            body: JSON.stringify({message: "added :)"})
          }
        } else {
          return {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "*",
              "Access-Control-Allow-Methods": "*"
            },
            body: JSON.stringify({message: "Card already exists."})
          }
        }
      }
      // if getting cards by collector numbers and set codes pairs
      else if (reqData.cnSetCodePairs != null) {
        const cursor = await collection.find({
          $expr:{
              $in:[
                  {
                      "collectorCode":"$collectorCode",
                      "setCode":"$setCode"
                  },
                  reqData.cnSetCodePairs
              ]
          }
        })
        let cards = []
        while (await cursor.hasNext()) {
          cards.push(await cursor.next())
        }
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
          },
          body: JSON.stringify(cards)
        }
      }
    } catch (error) {
      return { statusCode: 500, body: error.toString() }
    } finally {
      (await clientPromise).close()
    }
  } else {
    console.log("else request")
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*"
      },
      body: JSON.stringify({message: "hi"})
    }
  }
}
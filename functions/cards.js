import { MongoClient } from "mongodb";
require('dotenv').config()

const uri = process.env.MONGODB_URL
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
      // if posting many cards
      if (reqData.cards != null) {
        for (let i = 0; i < reqData.cards.length; i++) {
          console.log(reqData.cards[i])
          await collection.updateOne(
            { "setCode": reqData.cards[i].setCode, "collectorCode": reqData.cards[i].collectorCode },
            { "$set": reqData.cards[i] },
            {upsert: true}
          )
        }
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
          },
          body: JSON.stringify({message: "added :)"})
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
      // if getting cards by name and set code pairs
      else if (reqData.nameSetCodePairs != null) {
        const cursor = await collection.find({
          $expr:{
              $in:[
                  {
                      "name":"$name",
                      "setCode":"$setCode"
                  },
                  reqData.nameSetCodePairs
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
  } else if (event.httpMethod == "DELETE") {
    const clientPromise = await mongoClient.connect();
    try {
      const database = (await clientPromise).db("Card-Collection-Svelte");
      const collection = await database.collection("cards");
      // if posting cards by scryfallId
      var duplicates = [];
      const cursor = await collection.aggregate([
        {
          $group: {
            _id: { collectorCode: "$collectorCode", setCode: "$setCode" },
            dups: { "$addToSet": "$_id" },
            count: { "$sum": 1 }
          }
        },
        {
          $match: {
            count: { "$gt": 1 }
          }
        }
      ])
      .forEach(function(doc) {
        doc.dups.shift();      // First element skipped for deleting
        doc.dups.forEach( function(dupId){ 
            duplicates.push(dupId);   // Getting all duplicate ids
            }
        )
      })
      // Remove all duplicates in one go
      await collection.deleteMany({_id:{$in: duplicates}})
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "*"
        },
        body: JSON.stringify(duplicates)
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
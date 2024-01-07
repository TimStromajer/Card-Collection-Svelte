// @ts-nocheck
import { MongoClient } from "mongodb";
require('dotenv').config()

const uri = process.env.MONGODB_URL
const mongoClient = new MongoClient(uri);

export async function handler(event, context) {
  // GET DECK
  if (event.httpMethod == "GET") {
    const clientPromise = await mongoClient.connect();
    try {
      const database = (await clientPromise).db("Card-Collection-Svelte");
      const collection = database.collection("decks");

      // get all decks
      if (!event.queryStringParameters.username) {
        const cursor = await collection.find()

        let decks = []
        while (await cursor.hasNext()) {
          decks.push(await cursor.next())
        }

        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
          },
          body: JSON.stringify(decks)
        }
      // get single deck with cards info
      } else {
        const cursor = await collection.aggregate([
          { $match: {username: event.queryStringParameters.username, title: event.queryStringParameters.title}},
          { $limit: 1 },
          { $unwind: { path: "$cards", preserveNullAndEmptyArrays: true }},
          { $group: {_id: "$cards", count: {$count: {}}} },
          { $lookup: {
            from: "cards",
            localField: "_id",
            foreignField: "scryfallId",
            as: "cardInfo"
          }},
          {$project: {cardInfo: {$first: "$cardInfo"}, amount: "$count"}}
        ])
  
        let deck = []
        while (await cursor.hasNext()) {
          deck.push(await cursor.next())
        }
  
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
          },
          body: JSON.stringify(deck)
        }
      }
    } catch (error) {
      return { statusCode: 501, body: error.toString() }
    } finally {
      (await clientPromise).close()
    }
  // POST DECK
  } else if (event.httpMethod == "POST") {
    const clientPromise = await mongoClient.connect();
    let reqData = JSON.parse(event.body)
    try {
      const database = (await clientPromise).db("Card-Collection-Svelte");
      const collection = await database.collection("decks");
      var exists = await collection.findOne({title: reqData.title, username: reqData.username})
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
          body: JSON.stringify({message: "Deck with this title and username already exists."})
        }
      }
    } catch (error) {
      return { statusCode: 500, body: error.toString() }
    } finally {
      (await clientPromise).close()
    }
  // DELETE DECK
  } else if (event.httpMethod == "DELETE") {
    const clientPromise = await mongoClient.connect();
    let parameters = event.queryStringParameters
    try {
      const database = (await clientPromise).db("Card-Collection-Svelte");
      const collection = await database.collection("decks");
      var exists = await collection.findOneAndDelete({title: parameters.title, username: parameters.username})
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "*"
        },
        body: JSON.stringify({message: exists.message})
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
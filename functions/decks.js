// @ts-nocheck
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://slotim:Geslo123@cluster0.w0milto.mongodb.net/?retryWrites=true&w=majority";
const mongoClient = new MongoClient(uri);

export async function handler(event, context) {
  // GET DECK
  if (event.httpMethod == "GET") {
    const clientPromise = await mongoClient.connect();
    try {
      const database = (await clientPromise).db("Card-Collection-Svelte");
      const collection = database.collection("decks");

      const cursor = await collection.aggregate([
        { $match: {username: event.queryStringParameters.username, name: event.queryStringParameters.title}},
        { $limit: 1 },
        { $project: {_id: 0, cards: 1}},
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

      let deck
      while (await cursor.hasNext()) {
        deck = await cursor.next()
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
      var exists = await collection.findOne({name: reqData.title, author: reqData.username})
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
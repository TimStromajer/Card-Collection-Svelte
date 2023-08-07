import { MongoClient } from "mongodb";

const uri = "mongodb+srv://slotim:Geslo123@cardcluster.gznxz8t.mongodb.net/?retryWrites=true&w=majority";
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
      else if (event.queryStringParameters.name != null) {
        const cursor = await collection.findOne({name: event.queryStringParameters.name, setCode: event.queryStringParameters.setCode})
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
    } catch (err) {
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
      var exists = await collection.findOne({scryfallId: reqData.card.scryfallId})
      if (exists == null) {
        console.log("Adding new card " + reqData.card.name)
        await collection.insertOne({
          card: reqData.card.name
        })
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
        console.log("Card already exists.")
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
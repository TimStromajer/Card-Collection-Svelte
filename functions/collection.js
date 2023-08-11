import { MongoClient } from "mongodb";

const uri = "mongodb+srv://slotim:Geslo123@cluster0.w0milto.mongodb.net/?retryWrites=true&w=majority";
const mongoClient = new MongoClient(uri);

export async function handler(event, context) {
  // GET COLLECTION
  if (event.httpMethod == "GET") {
    const clientPromise = await mongoClient.connect();
    try {
      const database = (await clientPromise).db("Card-Collection-Svelte");
      const collection = database.collection("users");
      const cursor = await collection.aggregate([
        { $match: {username: event.queryStringParameters.username}},
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
    } catch (error) {
      return { statusCode: 501, body: error.toString() }
    } finally {
      (await clientPromise).close()
    }
  // ADD CARDS TO COLLECTION
  } else if (event.httpMethod == "POST") {
    const clientPromise = await mongoClient.connect();
    let reqData = JSON.parse(event.body)
    try {
      const database = (await clientPromise).db("Card-Collection-Svelte");
      const collection = await database.collection("users");
      var exists = await collection.findOne({username: reqData.username})
      if (exists == null) {
        console.log("This user does not exist: " + reqData.username)
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
          },
          body: JSON.stringify({message: "User does not exist."})
        }
      } else {
        console.log("Adding new cards")
        await collection.updateOne(
          { username: reqData.username },
          { $push: {cards: { $each: reqData.cards} } }
        )
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
          },
          body: JSON.stringify({message: "Added :)"})
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
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://slotim:Geslo123@cardcluster.gznxz8t.mongodb.net/?retryWrites=true&w=majority";
const mongoClient = new MongoClient(uri);

const handler = async (event) => {
  // GET COLLECTION
  if (event.httpMethod == "GET") {
    const clientPromise = await mongoClient.connect();
    try {
      const database = (await clientPromise).db("Card-Collection-Svelte");
      const collection = database.collection("users");
      const cursor = await collection.aggregate([
        {
          $lookup:
          {
            from: "users",
            localField: "scryfallId",
            foreignField: "scryfallId"
          },
          $match: {username: event.queryStringParameters.username}
        }
      ])
      var user = await cursor;
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "*"
        },
        body: JSON.stringify(user)
      }
    } catch (err) {
      return { statusCode: 501, body: error.toString() }
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

module.exports = { handler }
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://slotim:Geslo123@cardcluster.gznxz8t.mongodb.net/?retryWrites=true&w=majority";
const mongoClient = new MongoClient(uri);

const handler = async (event) => {
  // GET USER
  if (event.httpMethod == "GET") {
    const clientPromise = await mongoClient.connect();
    try {
      const database = (await clientPromise).db("Card-Collection-Svelte");
      const collection = database.collection("users");
      const cursor = await collection.findOne({username: event.queryStringParameters.username})
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
  // POST USER
  } else if (event.httpMethod == "POST") {
    const clientPromise = await mongoClient.connect();
    let reqData = JSON.parse(event.body)
    try {
      const database = (await clientPromise).db("Card-Collection-Svelte");
      const collection = await database.collection("users");
      var exists = await collection.findOne({username: reqData.username})
      if (exists == null) {
        console.log("Creating new user " + reqData.username)
        await collection.insertOne({
          username: reqData.username,
          cards: []
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
        console.log("User already exists.")
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
          },
          body: JSON.stringify({message: "User already exists."})
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

module.exports = { handler }
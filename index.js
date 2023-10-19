const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aunb3y8.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const productsCollection = client.db("ecoTechDB").collection("products");
    const cartCollection = client.db("ecoTechDB").collection("carts");

    //cart api start
    app.get("/carts", async (req, res) => {
      const result = await cartCollection.find().toArray();
      res.send(result);
    });

    app.post("/cart", async (req, res) => {
      const newCart = req.body;
      const result = await cartCollection.insertOne(newCart);
      res.send(result);
    });

    app.delete("/cart/:id", async(req, res) => {
      const deleteId = req.params.id;
      const query = {_id: new ObjectId(deleteId)};
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })
    // cart api close

    //find all product
    app.get("/products", async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
    });

    //find single product by id
    app.get("/product/:id", async (req, res) => {
      const productId = req.params.id;
      const query = {
        _id: new ObjectId(productId),
      };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    //single product create
    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    //update single product
    app.put("/product/:id", async (req, res) => {
      const updateId = req.params.id;
      const filter = { _id: new ObjectId(updateId) };
      const options = { upsert: true };
      const updatedProduct = req.body;

      const product = {
        $set: {
          image: updatedProduct.image,
          name: updatedProduct.name,
          brand: updatedProduct.brand,
          type: updatedProduct.type,
          description: updatedProduct.description,
          rating: updatedProduct.rating,
          price: updatedProduct.price,
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("connected to MongoDB");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("EcoTechUniverse is running now....");
});

app.listen(port, () => {
  console.log(`EcoTechUniverse listening on port ${port}`);
});

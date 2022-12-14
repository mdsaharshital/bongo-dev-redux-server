require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d9ucnme.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("big-dashboard");
    const blogCollection = db.collection("blogs");
    console.log("db is connected");
    //
    app.get("/blogs", async (req, res) => {
      const cursor = blogCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.post("/blog", async (req, res) => {
      const product = req.body;

      const result = await blogCollection.insertOne(product);

      res.send(result);
    });

    app.delete("/blog/:id", async (req, res) => {
      const id = req.params.id;

      const result = await blogCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
    app.put("/blog", async (req, res) => {
      const blog = req.body.blog;
      const id = req.body.id;
      const newBlog = {
        source: blog.source,
        topic: blog.topic,
        author: blog.author,
        title: blog.title,
        content: blog.content,
        description: blog.description,
        urlToImage: blog.urlToImage,
        publishedAt: blog.publishedAt,
      };
      console.log("", newBlog);
      // create a document that sets the plot of the movie
      const updateDoc = {
        $set: newBlog,
      };
      const result = await blogCollection.updateOne(
        { _id: ObjectId(id) },
        updateDoc
      );
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

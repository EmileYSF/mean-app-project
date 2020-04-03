const express = require("express");
const bodyParser = require("body-parser");
const mongoClient = require('mongodb').MongoClient;


const assert = require('assert');


const dbUrl = 'mongodb://localhost:27017';
const dbName = 'meanapp';

const app = express();

const client = new mongoClient(dbUrl);
client.connect()
  .then(() => {
    console.log("Connected to DB !");
    const db = client.db(dbName);


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      next();
    });

    app.post("/products", (req, res, next) => {
      const product = req.body;
      console.log(product);
      db.collection("products").insertOne({title: product.title, description: product.description}, function(err, doc) {
        assert.equal(null, err);
        assert.equal(1, doc.insertedCount);
      });
      res.status(201).json({
        message : "Product added successfully !"
      });
    });

    app.get("/products", (req, res, next) => {
      const products = [
        {
          id: "kjzgfkjhfdsf",
          title: "sheh!",
          description: "gros sheh !"
        },
        {
          id: "khjflksslkjfsd",
          title: "sheh2!",
          description: "encore un plus gros sheh !"
        }
      ];
      res.status(200).json({
        products: products
      });
    });

  })
  .catch(() => {
    console.log("Connection failed !");
  });

client.close()

module.exports = app;

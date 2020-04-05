const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const name = 'meanapp';

var db;

module.exports = {
  connectDb: function(callback) {
    mongoClient.connect(url, (err, client) => {
      db = client.db(name)
      console.log("Connected to DB !");
      return callback(err);
    });
  },

  getDb: function() {
    return db;
  }
};

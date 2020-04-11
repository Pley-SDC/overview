const { MongoClient } = require('mongodb');

const mongoUrl = process.env.DB_URL || 'mongodb://localhost:27017';

function initializeMongoConnection() {
  return new Promise((resolve, reject) => {
    console.log('Mongo url', mongoUrl);
    const client = new MongoClient(mongoUrl, { useNewUrlParser: true });
    client.connect((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Mongo Connection established!');
        const collection = client.db('overview').collection('restaurants');
        resolve({ client, collection });
      }
    });
  });
}

exports.initializeMongoConnection = initializeMongoConnection;

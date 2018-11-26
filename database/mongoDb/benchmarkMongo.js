const { ObjectID } = require('mongodb');
const { generateRestaurant, getRandomInt, generateImages } = require('./dataGenerators.js');
const { initializeMongoConnection } = require('./mongoConnect.js');

const db = {
  client: undefined,
  collection: undefined,
};

function assignConnectionVariables() {
  return initializeMongoConnection()
    .then(({ client, collection }) => {
      db.client = client;
      db.collection = collection;
    });
}

function convertHrTimeToMs([seconds, nanoseconds]) {
  let milliseconds = 0;
  milliseconds += seconds * 1000;
  milliseconds += nanoseconds / 1000000;
  return milliseconds;
}

function timeQuery(queryFunc, ...params) {
  const startTime = process.hrtime();
  queryFunc(...params)
    .then((result) => {
      const endTime = process.hrtime(startTime);
      console.log(`Query took ${convertHrTimeToMs(endTime)} milliseconds`);
      console.log('RESULTS:');
      if (result.result) {
        console.log(result.result);
      } else {
        console.log(JSON.stringify(result));
      }
    });
}

function generateArrayOfRestaurants(num) {
  const restaurantsArr = [];
  for (let i = 0; i < num; i += 1) {
    restaurantsArr.push(generateRestaurant());
  }
  return restaurantsArr;
}

function getRandomId(listOfUnparsedObjectIds) {
  const idx = getRandomInt(listOfUnparsedObjectIds.length - 1);
  return ObjectID(listOfUnparsedObjectIds[idx]);
}

function insertRestaurant(restaurant) {
  return new Promise((resolve, reject) => {
    db.collection.insertOne(restaurant, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function findRestaurantById(parsedObjectId) {
  return new Promise((resolve, reject) => {
    db.collection.findOne({ _id: parsedObjectId }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function deleteRestaurant(parsedObjectId) {
  return new Promise((resolve, reject) => {
    db.collection.deleteOne({ _id: parsedObjectId }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function addImageToRestaurant(img, parsedObjectId) {
  return new Promise((resolve, reject) => {
    db.collection.updateOne({ _id: parsedObjectId }, { $push: { images: img } }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function testFindRestaurantQuery() {
  assignConnectionVariables()
    .then(() => {
      const queryId = ObjectID('5bf5c6a0de88b93f579e6437');
      timeQuery(findRestaurantById, queryId);
    });
}

testFindRestaurantQuery();

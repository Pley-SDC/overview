const seed = require('./dataGenerators');
const { Restaurant } = require('./index.js');
const { initializeMongoConnection } = require('./mongoConnect');

function logProgress(logPerNum, currentNum, totalNum) {
  if (currentNum % logPerNum === 0) {
    console.log(`${currentNum} of ${totalNum} loops`);
  }
}

function synchronousLoop(func, params, numOfLoops, cb) {
  let currentLoop = 1;
  const startTime = process.hrtime();

  async function innerloop() {
    if (currentLoop <= numOfLoops) {
      logProgress(10, currentLoop, numOfLoops);
      await func(...params);
      currentLoop += 1;
      innerloop();
    } else if (cb) {
      const endTime = process.hrtime(startTime);
      const totalSeconds = endTime[0];
      cb(totalSeconds);
    }
  }
  innerloop();
}

const insertRestaurantRecords = (collection, numberToInsert) => {
  const batch = [];
  for (let i = 0; i < numberToInsert; i += 1) {
    batch.push(seed.generateRestaurant());
  }
  return Restaurant.create(batch).catch(err => console.error(err));
};

initializeMongoConnection()
  .then(({ collection }) => {
    synchronousLoop(insertRestaurantRecords, [collection, 1000], 10000, seconds => (
      console.log(`done in ${seconds / 60} minutes`)
    ));
  })
  .catch(err => console.error(err));

// initializeMongoConnection()
//   .then(({ collection }) => insertRestaurantRecords(collection, 10))
//   .then(() => console.log('finished inserting'))
//   .catch(err => console.error(err));

exports.insertRestaurantRecords = insertRestaurantRecords;

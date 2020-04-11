const { initializeMongoConnection } = require('./mongoConnect');
const generateRestaurant = require('./restaurantGenerator');
const { asynchronousLoop } = require('./utils');

const TOTAL_PRIMARY_RECORDS = 1e3;

let batchSize = 1000;
let logRate = 1e5;
if (batchSize > TOTAL_PRIMARY_RECORDS) {
  batchSize = TOTAL_PRIMARY_RECORDS;
}

if (TOTAL_PRIMARY_RECORDS % batchSize !== 0) {
  throw new Error('TOTAL_PRIMARY_RECORDS must be perfectly divisible by batchSize');
}

if (logRate > TOTAL_PRIMARY_RECORDS) {
  logRate = TOTAL_PRIMARY_RECORDS / 10;
}


const NUMBER_OF_LOOPS = TOTAL_PRIMARY_RECORDS / batchSize;

// const asynchronousLoop = (func, numOfLoops, cb, logger = () => {}) => {
initializeMongoConnection()
  .then(({ collection }) => {
    const insertRestaurantRecords = () => {
      const batch = [];
      for (let i = 0; i < batchSize; i += 1) {
        batch.push(generateRestaurant());
      }
      return new Promise((resolve, reject) => {
        collection.insertMany(batch, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    };

    const callback = (seconds) => {
      console.log(`done in ${seconds / 60} minutes`)
      process.exit();
    };

    const logger = (currentLoop) => {
      if ((currentLoop * batchSize) % logRate === 0) {
        const loopsCompleted = `LOOPS COMPLETE: ${currentLoop - 1}/${NUMBER_OF_LOOPS}`;
        const recordsInserted = `RECORDS INSERTED: ${(currentLoop - 1) * batchSize}/${NUMBER_OF_LOOPS * batchSize}`;
        console.log(`${loopsCompleted}\n${recordsInserted}`);
      }
    };

    asynchronousLoop(insertRestaurantRecords, NUMBER_OF_LOOPS, callback, logger);
  })
  .catch(err => console.error(err));

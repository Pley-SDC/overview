const { initializeMongoConnection } = require('./mongoConnect');
const generateRestaurant = require('./restaurantGenerator');
const { asynchronousLoop } = require('./utils');


const TOTAL_PRIMARY_RECORDS = parseInt(process.argv[2], 10); // first argument

if (Number.isNaN(TOTAL_PRIMARY_RECORDS)) {
  throw new Error('Check command line argument. Must provide number of records to insert.');
}

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

    let lastLogTime = process.hrtime();
    const recordsPerLoop = TOTAL_PRIMARY_RECORDS / NUMBER_OF_LOOPS;

    const logger = (loopsCompleted) => {
      if (loopsCompleted === 0) {
        return console.log('Beginning to seed...');
      }

      const recordsInserted = loopsCompleted * recordsPerLoop;

      if (recordsInserted % logRate === 0) {
        const recordsRemaining = TOTAL_PRIMARY_RECORDS - recordsInserted;
        const secondsSinceLastLog = process.hrtime(lastLogTime)[0];
        lastLogTime = process.hrtime();

        const logsRemaining = recordsRemaining / logRate;
        const estimatedMinutesRemaining = (secondsSinceLastLog * logsRemaining) / 60;
        console.log(`RECORDS INSERTED: ${recordsInserted}/${TOTAL_PRIMARY_RECORDS}`);
        console.log(`LOOP SPEED (sec): ${secondsSinceLastLog}`);
        console.log(`TIME REMAINING (min): ${estimatedMinutesRemaining}`);
      }
    };

    asynchronousLoop(insertRestaurantRecords, NUMBER_OF_LOOPS, callback, logger);
  })
  .catch(err => console.error(err));

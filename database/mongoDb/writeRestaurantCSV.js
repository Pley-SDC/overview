const path = require('path');
const fs = require('fs');

const generateRestaurant = require('./restaurantGenerator.js');

const CSVPath = path.join(__dirname, 'restaurants.csv');

const writer = fs.createWriteStream(CSVPath, 'utf8');

const restaurant = Object.values(generateRestaurant());
const csvLine = restaurant.join(',');
writer.write(csvLine, (err) => {
  if (err) return console.log(err);
  console.log('complete!');
})
function writeOneMillionTimes(writer, callback) {
  let i = 1000000;
  write();
  function write() {
    let ok = true;
    let batch = [];
    do {
      for (let j = 0; j < 1000; j += 1) {
        batch.push(Object.values(generateRestaurant()).join(','));
      }
      batch.push('');
      i -= 1000;
      if (i === 0) {
        // Last time!
        writer.write(batch.join('\n'), 'utf8', callback);
      } else {
        // See if we should continue, or wait.
        // Don't pass the callback, because we're not done yet.
        ok = writer.write(batch.join('\n'), 'utf8');
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // Had to stop early!
      // Write some more once it drains.
      writer.once('drain', write);
    }
  }
}

writeOneMillionTimes(writer, () => {
  console.log('DONE!!');
});

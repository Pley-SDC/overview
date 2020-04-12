const getRandomPositiveIntBelow = max => Math.floor(Math.random() * max) + 1;

const createIncrementer = (start) => {
  let id = start;
  return () => {
    const currentId = id;
    id += 1;
    return currentId;
  };
};

const convertIntToZeroPaddedString = (idx, desiredLength = 4) => {
  const zeroCount = desiredLength - idx.toString().length;
  return Array(zeroCount).fill('0').join('') + idx.toString();
};

const getRandomElement = (array) => {
  const randomCategoryIndex = getRandomPositiveIntBelow(array.length) - 1;
  return array[randomCategoryIndex];
};

const logLoopsCompleted = (logPerNum, currentNum, totalNum) => {
  if (currentNum % logPerNum === 0) {
    console.log(`${currentNum} of ${totalNum} loops`);
  }
};

const asynchronousLoop = (func, numOfLoops, cb, logger = () => {}) => {
  let currentLoop = 1;
  const startTime = process.hrtime();

  async function innerloop() {
    if (currentLoop <= numOfLoops) {
      logger(currentLoop - 1, numOfLoops);
      await func();
      currentLoop += 1;
      innerloop();
    } else if (cb) {
      logger(currentLoop - 1, numOfLoops);
      const endTime = process.hrtime(startTime);
      const totalSeconds = endTime[0];
      cb(totalSeconds);
    }
  }
  innerloop();
};

module.exports = {
  getRandomPositiveIntBelow,
  createIncrementer,
  convertIntToZeroPaddedString,
  getRandomElement,
  logLoopsCompleted,
  asynchronousLoop,
};

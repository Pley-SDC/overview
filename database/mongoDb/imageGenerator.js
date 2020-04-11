const faker = require('faker');
const Utils = require('./utils');

const TOTAL_IMGS_ON_S3 = 900;
const IMAGES_PER_RESTAURANT = 5;
const IMAGE_BASE_URL = 'https://s3-us-west-1.amazonaws.com/sdc-overview-images/images/';
const IMAGE_START_ID = 0;
const imageIncrementer = Utils.createIncrementer(IMAGE_START_ID);
const CATEGORIES = ['drinks', 'food'];

const generateUserName = () => faker.name.findName();
const generateDescription = () => faker.lorem.sentences();
const generatePostedDate = () => faker.date.recent();
const generateImageUrl = (totalImgsOnS3) => {
  const randomImageIdx = Utils.getRandomPositiveIntBelow(totalImgsOnS3);
  const paddedIdx = Utils.convertIntToZeroPaddedString(randomImageIdx);
  return `${IMAGE_BASE_URL}${paddedIdx}.jpeg`;
};

const generateImages = () => {
  const imagesArr = [];

  for (let j = 0; j < IMAGES_PER_RESTAURANT; j += 1) {
    const imageObj = {
      imageId: imageIncrementer(),
      userName: generateUserName(),
      image: generateImageUrl(TOTAL_IMGS_ON_S3),
      description: generateDescription(),
      posted: generatePostedDate(),
      category: Utils.getRandomElement(CATEGORIES),
    };
    imagesArr.push(imageObj);
  }

  return imagesArr;
};

module.exports = generateImages;

const faker = require('faker');
const Utils = require('./utils');
const generateImages = require('./imageGenerator');

const MAX_COST_RATING = 5;
const MAX_GOOGLE_MAP_IDX = 5;
const RESTAURANT_ID_START = parseInt(process.argv[3], 10);
const MAP_IMG_BASE_URL = 'https://s3-us-west-1.amazonaws.com/yump-sf-overview/maps/';
const restaurantIncrementer = Utils.createIncrementer(RESTAURANT_ID_START);

const generateRestaurantName = () => faker.company.companyName();
const generateAddress = () => [
  faker.address.streetAddress(),
  faker.address.city(),
  faker.address.state(),
  faker.address.zipCode(),
].join(', ');
const generatePhoneNum = () => faker.phone.phoneNumberFormat();
const generateWebsite = () => faker.internet.url();
const generateCostRating = maxRating => Utils.getRandomPositiveIntBelow(maxRating);
const generateGoogleMapImg = maxIdx => `${MAP_IMG_BASE_URL}${Utils.getRandomPositiveIntBelow(maxIdx)}.png`;

const generateRestaurant = () => ({
  restaurantId: restaurantIncrementer(),
  name: generateRestaurantName(),
  // address: generateAddress(),
  cost: generateCostRating(MAX_COST_RATING),
  phone: generatePhoneNum(),
  website: generateWebsite(),
  googleMap: generateGoogleMapImg(MAX_GOOGLE_MAP_IDX),
  // images: generateImages(),
});

module.exports = generateRestaurant;

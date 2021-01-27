const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = process.env.DB_URL || 'mongodb://localhost:27017';

mongoose.connect(`${mongoURL}/overview`, {
  useNewUrlParser: true,
  poolSize: 5,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to mongo at', mongoURL));

const userSchema = mongoose.Schema({
  userName: String,
  email: { type: String, unique: true, notNull: true },
});

const imageSchema = mongoose.Schema({
  imageId: { type: Number, unique: true },
  userName: String,
  image: String,
  description: String,
  posted: Date,
  category: String,
});

const restaurantSchema = mongoose.Schema({
  restaurantId: Number,
  name: String,
  address: String,
  cost: Number,
  phone: String,
  website: String,
  googleMap: String,
  images: [imageSchema], // don't do this
});

exports.Restaurant = db.model('restaurant', restaurantSchema);

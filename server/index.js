// require('newrelic');
require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('../database/mongoDb/index.js');


const app = express();
const { Restaurant } = db;

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public/')));
app.get('*.js', (req, res, next) => {
  req.url += '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});

app.get('/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/api/:id', (req, res) => {
  const { id } = req.params;
  Restaurant.findOne({ restaurantId: id }, (err, restaurantData) => {
    if (err) {
      console.error(err);
      return res.sendStatus(404);
    }
    return res.send(restaurantData);
  });
});

app.post('/api/restaurants/', (req, res) => {
  const restaurantData = req.body;
  console.log(restaurantData);
  Restaurant.create(restaurantData, (err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(201);
    }
  });
});

app.post('/api/restaurants/:id/images/', (req, res) => {
  const { id } = req.params;
  const image = req.body;
  Restaurant.findOneAndUpdate({ restaurantId: id }, { $push: { images: image } }, (err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(201);
    }
  });
});

app.put('/api/restaurants/:id', (req, res) => {
  const { id } = req.params;
  Restaurant.findOneAndUpdate({ restaurantId: id }, req.body, (err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(202);
    }
  });
});

app.put('/api/restaurants/:restaurantId/images/:imageId', (req, res) => {
  const { restaurantId, imageId } = req.params;
  const newImageData = req.body;
  const querySelector = { restaurantId, 'images.imageId': imageId };
  const updates = Object.keys(newImageData).reduce((acc, key) => {
    acc[`images.$.${key}`] = newImageData[key];
    return acc;
  }, {});
  Restaurant.findOneAndUpdate(querySelector, updates, (err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(202);
    }
  });
});

app.delete('/api/restaurants/:restaurantId', (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.deleteOne({ restaurantId }, (err) => {
    if (err) {
      console.error(err);
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
    }
  });
});

app.delete('/api/restaurants/:restaurantId/images/:imageId', (req, res) => {
  const { restaurantId, imageId } = req.params;
  const documentSelector = { restaurantId };
  const imageMatcher = { $pull: { images: { imageId } } };
  Restaurant.update(documentSelector, imageMatcher, (err) => {
    if (err) {
      console.error(err);
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
    }
  });
});

app.get('/api/restaurants/:id', (req, res) => {
  const { id } = req.params;
  Restaurant.findOne({ restaurantId: id }, (err, results) => {
    if (err) {
      console.error(err);
      res.sendStatus(404);
    } else {
      res.send(results);
    }
  });
});

app.get('/api/restaurants/:restaurantId/images/:imageId', (req, res) => {
  console.log('I got hit');
  const { restaurantId, imageId } = req.params;
  const documentSelector = { restaurantId };
  const imageMatcher = { images: { $elemMatch: { imageId } } };
  Restaurant.findOne(documentSelector, imageMatcher, (err, results) => {
    if (err) {
      console.error(err);
      res.sendStatus(404);
    } else {
      res.send(results);
    }
  });
});

app.listen(process.env.PORT, console.log('Listening on port:', process.env.PORT));

const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const deleteRoutes = require('./routes/deleteRoutes');
const listingRoutes = require('./routes/listingRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
require('./config/db');
const cloudinary = require('cloudinary').v2;
const asyncHandler = require('./middleware/asyncHandler'); 


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://react-listings-frontend.onrender.com'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(deleteRoutes);
app.use(listingRoutes);
app.use(uploadRoutes);
app.use(express.static(path.join(__dirname, 'build')));

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

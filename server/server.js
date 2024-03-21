const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const deleteRoutes = require('./routes/deleteRoutes');
const listingRoutes = require('./routes/listingRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const connectDB = require('./config/db')
const cloudinary = require('cloudinary').v2;

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

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(deleteRoutes);
app.use(listingRoutes);
app.use(uploadRoutes);

connectDB();

const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

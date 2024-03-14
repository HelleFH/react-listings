const express = require('express');
const { Listing } = require('../model/listingModel');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const asyncHandler = require('../middleware/asyncHandler'); // Update with the correct path
const router = express.Router();

// Multer configuration for file upload
const upload = multer({
  storage: multer.memoryStorage(), // Store the file in memory instead of the local file system
  limits: {
    fileSize: 100000000, // max file size 1MB = 10000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      return cb(new Error('Only upload files with jpeg, jpg, or png format.'));
    }
    cb(null, true); // continue with upload
  },
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const { generateDeletionToken } = require('../utils/tokenUtils'); // Adjust the path accordingly

// Route to handle image upload and listing creation
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { buffer } = req.file;
    const { title, description, location } = req.body;

    // Upload file to Cloudinary directly from the buffer
    const result = await cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (error, result) => {
      if (error) {
        console.error('Error while uploading to Cloudinary:', error);
        return res.status(400).json({ error: 'Error while uploading listing data. Try again later.' });
      }

      // Generate a deletion token (this can be a random string or a unique identifier)
      const deletionToken = generateDeletionToken();

      // Create a new Listing with Cloudinary URL, deletion token, and other data
      const listing = new Listing({
        title,
        description,
        location,
        cloudinaryUrl: result.secure_url,
        cloudinaryPublicId: result.public_id, // Store Cloudinary public ID
        cloudinaryDeleteToken: deletionToken, // Store Cloudinary delete token
      });
      

      // Save the listing to the database
      await listing.save();

      // Respond with success message
      res.json({ msg: 'Listing data uploaded successfully.' });
    }).end(buffer);
  } catch (error) {
    console.error('Error while processing listing data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

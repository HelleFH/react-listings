const express = require('express');
const { Listing } = require('../model/listingModel');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const asyncHandler = require('../middleware/asyncHandler'); 
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(), 
  limits: {
    fileSize: 100000000, // max file size 10MB 
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      return cb(new Error('Only upload files with jpeg, jpg, or png format.'));
    }
    cb(null, true); 
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const { generateDeletionToken } = require('../utils/tokenUtils'); 

// Route to handle image upload and listing creation
router.post('/upload', upload.single('file'), asyncHandler(async (req, res) => {
  const { buffer } = req.file;
  const { title, description, location } = req.body;

  // Upload file to Cloudinary directly from the buffer
  const result = await cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (error, result) => {
    if (error) {
      console.error('Error while uploading to Cloudinary:', error);
      return res.status(400).json({ error: 'Error while uploading listing data. Try again later.' });
    }

    const deletionToken = generateDeletionToken();

    const listing = new Listing({
      title,
      description,
      location,
      cloudinaryUrl: result.secure_url,
      cloudinaryPublicId: result.public_id, 
      cloudinaryDeleteToken: deletionToken, 
    });

    await listing.save();

    res.json({ msg: 'Listing data uploaded successfully.' });
  }).end(buffer);
}));

module.exports = router;

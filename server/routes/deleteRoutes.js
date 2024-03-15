const express = require('express');
const { Listing } = require('../model/listingModel');
const cloudinary = require('cloudinary').v2;
const asyncHandler = require('../middleware/asyncHandler');
const router = express.Router();

// Route to delete Cloudinary image when a listing is updated with a new image
router.delete('/delete-image/:publicId', asyncHandler(async (req, res) => {
  const { publicId } = req.params;
  const result = await cloudinary.uploader.destroy(publicId);
  console.log('Cloudinary deletion result:', result);
  res.json({ message: 'Image deleted from Cloudinary successfully' });
}));

// Route to delete a listing
router.delete('/listings/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

//delete image using cloudinary public ID
  const { cloudinaryPublicId } = deletedListing;
  console.log('Cloudinary public_id:', cloudinaryPublicId);

  if (cloudinaryPublicId) {
    const result = await cloudinary.uploader.destroy(cloudinaryPublicId);
    console.log('Cloudinary deletion result:', result);
  }

  res.json({ message: 'Listing deleted successfully', deletedListing });
}));

module.exports = router;

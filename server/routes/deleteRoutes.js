const express = require('express');
const { Listing } = require('../model/listingModel');
const cloudinary = require('cloudinary').v2;
const router = express.Router();



// Route to delete Cloudinary image
router.delete('/delete-image/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;

    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary deletion result:', result);

    res.json({ message: 'Image deleted from Cloudinary successfully' });
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.delete('/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the listing by ID
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Use the stored public_id to delete the image from Cloudinary
    const { cloudinaryPublicId } = deletedListing;
    console.log('Cloudinary public_id:', cloudinaryPublicId);

    if (cloudinaryPublicId) {
      const result = await cloudinary.uploader.destroy(cloudinaryPublicId);
      console.log('Cloudinary deletion result:', result);
    }

    res.json({ message: 'Listing deleted successfully', deletedListing });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

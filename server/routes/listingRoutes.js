const express = require('express');
const { Listing } = require('../model/listingModel');
const asyncHandler = require('../middleware/asyncHandler'); 
const router = express.Router();

router.get('/listings/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }
  res.status(200).json(listing);
}));

router.get('/listings', asyncHandler(async (req, res) => {
  const listings = await Listing.find();
  res.json(listings);
}));

router.put('/listings/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, location, cloudinaryUrl } = req.body;
  let existingListing = await Listing.findById(id);
  if (!existingListing) {
    return res.status(404).json({ error: 'Listing not found' });
  }
  if (cloudinaryUrl && existingListing.cloudinaryUrl !== cloudinaryUrl) {
    await Listing.findByIdAndDelete(id);
    existingListing = await Listing.create({
      title,
      description,
      location,
      cloudinaryUrl,
    });
    return res.json({ message: 'Listing updated successfully', updatedListing: existingListing });
  }
  existingListing.title = title;
  existingListing.description = description;
  existingListing.location = location;
  existingListing.cloudinaryUrl = cloudinaryUrl;
  existingListing = await existingListing.save();
  res.json({ message: 'Listing updated successfully', updatedListing: existingListing });
}));

module.exports = router;

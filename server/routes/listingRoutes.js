const express = require('express');
const { Listing } = require('../model/listingModel');
const asyncHandler = require('../middleware/asyncHandler'); // Update with the correct path
const router = express.Router();

// Wrap each route handler with asyncHandler

router.get('/listings/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;

  // Fetch the listing from the database based on the ID
  const listing = await Listing.findById(id);

  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  // If the listing is found, send it in the response
  res.status(200).json(listing);
}));

router.get('/listings', asyncHandler(async (req, res) => {
  const listings = await Listing.find();
  res.json(listings);
}));

router.put('/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, cloudinaryUrl } = req.body;

    // Find the existing listing by ID
    let existingListing = await Listing.findById(id);

    if (!existingListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (cloudinaryUrl && existingListing.cloudinaryUrl !== cloudinaryUrl) {
      // Delete the old listing if a new cloudinaryUrl is provided
      await Listing.findByIdAndDelete(id);

      // Create a new listing with the updated information
      existingListing = await Listing.create({
        title,
        description,
        location,
        cloudinaryUrl,
      });

      return res.json({ message: 'Listing updated successfully', updatedListing: existingListing });
    }

    // If no new cloudinaryUrl is provided or it's the same, update the existing listing
    existingListing.title = title;
    existingListing.description = description;
    existingListing.location = location;
    existingListing.cloudinaryUrl = cloudinaryUrl;

    // Save the updated listing
    existingListing = await existingListing.save();

    res.json({ message: 'Listing updated successfully', updatedListing: existingListing });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

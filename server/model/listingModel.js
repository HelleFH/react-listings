const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  cloudinaryUrl: { type: String, required: true },
  cloudinaryPublicId: { type: String, required: true }, // Store Cloudinary public ID here
  cloudinaryDeleteToken: { type: String, required: true }, // Add Cloudinary delete token field
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = { Listing };

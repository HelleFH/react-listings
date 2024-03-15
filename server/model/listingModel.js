const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  cloudinaryUrl: { type: String },
  cloudinaryPublicId: { type: String, required: true }, 
  cloudinaryDeleteToken: { type: String, required: true }, 
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = { Listing };

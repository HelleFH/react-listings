import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { handleDeleteListing } from '../components/handleDeleteListing'; 

// Define the API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL;

function ShowListingList() {
  // State variables to manage listings, error, modal visibility, and selected listing ID
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);

  // Fetch listings from the API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch listings from the API
        const response = await axios.get(`${API_URL}/listings`);
        const mongodbListings = response.data;
        // Update listings state with fetched data
        setListings(mongodbListings);
        setError(null);
      } catch (error) {
        console.log('Error fetching listings:', error);
        setError('Error fetching listings. Please try again.');
      }
    };

    fetchData(); // Invoke the fetchData function
  }, []); // Empty dependency array to ensure it runs only once

  // Function to render error message if there's an error
  const renderError = () => (
    <div className='alert alert-danger'>{error || 'An unexpected error occurred.'}</div>
  );

  // Function to open delete confirmation modal for a listing
  const openDeleteModal = (listingId) => {
    setSelectedListingId(listingId);
    setShowDeleteModal(true);
  };

  // Function to close delete confirmation modal
  const closeDeleteModal = () => {
    setSelectedListingId(null);
    setShowDeleteModal(false);
  };

  // Function to truncate description of a listing
 const truncateDescription = (description, wordCount) => {
  const words = description.split(' ');
  const truncatedWords = words.slice(0, wordCount);
  return truncatedWords.join(' ') + (words.length > wordCount ? '...' : '');
};

  // Function to render listing cards
  const renderCards = () => {
    return listings.map((listing, index) => (
      <div key={listing.cloudinaryUrl ? `listing-${listing._id}` : `local-listing-${index}`} className='listing-card-container'>
        {listing.cloudinaryUrl ? (
          <ListingCard listing={{
            ...listing, description: truncateDescription(listing.description, 20),
          }} onDelete={() => openDeleteModal(listing._id)} />
        ) : (
          <div />
        )}
      </div>
    ));
  };

  // Render the component
  return (
    <div className='ShowListingList'>
      {/* Page title and description */}
      <h1 className='text-center display-1' style={{ fontFamily: 'Cormonrant' }}>Listings</h1>
      <p className='text-center'>Feel free to create, edit, or delete listings</p>
      {/* Button to add a new listing */}
      <div className='col-md-12'>
        <Link to='/create-listing' className='mt-3 mb-3 btn btn-outline-warning float-right'>
          + Add New Listing
        </Link>
      </div>
      {/* Container for listing cards */}
      <div className='container-lg grid-container'>
        {/* Render error message if there's an error, otherwise render listing cards */}
        {error ? (
          renderError()
        ) : (
          <div className='grid'>
            {renderCards()}
          </div>
        )}
      </div>
      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onCancel={closeDeleteModal}
        onConfirm={() => {
          // Call handleDeleteListing function with selectedListingId, setListings, and setShowDeleteModal
          handleDeleteListing(selectedListingId, setListings, setShowDeleteModal); 
        }}
      />
    </div>
  );
}

export default ShowListingList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { API_URL } from '../utils/constants';
import { truncateDescription } from '../store/appStore';
import { handleDeleteListing } from '../store/appStore'; 

function ShowListingList() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/listings`);
        const mongodbListings = response.data;
        setListings(mongodbListings);
        setError(null);
      } catch (error) {
        console.log('Error fetching listings:', error);
        setError('Error fetching listings. Please try again.');
      }
    };

    fetchData();
  }, []); // Empty dependency array to ensure it runs only once

  const renderError = () => (
    <div className='alert alert-danger'>{error || 'An unexpected error occurred.'}</div>
  );

  const openDeleteModal = (listingId) => {
    setSelectedListingId(listingId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedListingId(null);
    setShowDeleteModal(false);
  };

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

  return (
    <div className='ShowListingList'>
      <h1 className='text-center display-1' style={{ fontFamily: 'Cormonrant' }}>Listings</h1>
      <p className='text-center'>Feel free to create, edit or delete listings</p>
      <div className='col-md-12'>
        <Link to='/create-listing' className='mt-3 mb-3 btn btn-outline-warning float-right'>
          + Add New Listing
        </Link>
      </div>
      <div className='container-lg grid-container'>
        {error ? (
          renderError()
        ) : (
          <div className='grid'>
            {renderCards()}
          </div>
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onCancel={closeDeleteModal}
        onConfirm={() => {
          handleDeleteListing(selectedListingId, setListings, setShowDeleteModal); 
        }}
      />
    </div>
  );
}

export default ShowListingList;

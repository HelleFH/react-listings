import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ListingCard from '../components/ListingCard';
import { handleDeleteListing } from '../components/handleDeleteListing';
import axios from 'axios';

const IndividualPage = () => {
  const [singleListing, setSingleListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

   const fetchMongoDBListings = async () => {
    try {
      // Send GET request to fetch listings
      const response = await axios.get(`${API_URL}/listings`);
      return response.data; // Return the data if successful
    } catch (error) {
      throw error; // Throw the error for the caller to handle
    }
  };

  const getSingleListing = async () => {
    try {
      const listings = await fetchMongoDBListings();
      setSingleListing(listings.find(listing => listing._id === id));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching single listing:', error);
      setError('Error fetching listing. Please try again.');
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };


  return (
    <div className="container mt-5">
      <Link to="/">
        <button className="mb-4 btn btn-outline-warning">Back to Listings</button>
      </Link>
      <div className="col-md-12 mx-auto" style={{ maxWidth: '800px' }}>
        <div className="container-lg">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : singleListing ? (
            <div className="individual-listing-container">
              <ListingCard listing={singleListing} onDelete={() => setShowDeleteModal(true)} />
              <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onCancel={closeDeleteModal}
                onConfirm={handleDeleteListing}
              />
            </div>
          ) : (
            <div className="text-center">{error || 'No Items'}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndividualPage;
  
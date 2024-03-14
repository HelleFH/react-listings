import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchCombinedListings, deleteListing } from '../store/appStore';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ListingCard from '../components/ListingCard';

const IndividualPage = () => {
  const [combinedListings, setCombinedListings] = useState([]);
  const [singleListing, setSingleListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const getSingleListing = async () => {
    await fetchCombinedListings(setCombinedListings, setError);
    setLoading(false);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteListing = async () => {
    await deleteListing(singleListing._id, setCombinedListings, navigate, setShowDeleteModal);
    closeDeleteModal();
  };

  useEffect(() => {
    if (id) {
      getSingleListing();
    }
  }, [id]);

  useEffect(() => {
    if (combinedListings.length > 0 && id) {
      setSingleListing(combinedListings.find((listing) => listing._id === id));
    }
  }, [combinedListings, id]);

  return (
    <div className="container mt-5">
      <Link to="/">
        <button className="button button--blue mt-3 mb-3  float-right">Back to Listings</button>
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
            <div className="text-center">No Items </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndividualPage;

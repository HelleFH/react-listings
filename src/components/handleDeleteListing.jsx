import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;


export const handleDeleteListing = async (listingId, setListings, setShowDeleteModal) => {
  try {
    // Send DELETE request to delete the listing
    await axios.delete(`${API_URL}/listings/${listingId}`);
    
    // Refetch listings and update state
    const response = await axios.get(`${API_URL}/listings`);
    setListings(response.data);
    
    // Hide the delete modal
    setShowDeleteModal(false);
    
    console.log('Listing deleted successfully');
  } catch (error) {
    throw error; 
  }
};

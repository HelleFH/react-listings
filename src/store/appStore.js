// frontendAppStore.js
import axios from 'axios';
import localListings from '../data/localListings.json';  // Add this line


export const API_URL = 'http://localhost:3030';
export const CLOUDINARY_CLOUD_NAME = 'dvagswjsf';
export const CLOUDINARY_API_KEY = '541989745898263';
export const CLOUDINARY_API_SECRET = 'ppzQEDXFiCcFdicfNYCupeZaRu0';
export const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/`;

export const fetchListingInfo = async (id, setListing, setPreviewSrc) => {
  try {
    const response = await axios.get(`${API_URL}/listings/${id}`);
    setListing({
      title: response.data.title,
      description: response.data.description,
      location: response.data.location,
      cloudinaryUrl: response.data.cloudinaryUrl,
    });
    setPreviewSrc(`${response.data.cloudinaryUrl}`);
  } catch (error) {
    console.error('Error fetching listing:', error);
  }
};

export const uploadListing = async (file, listing, setFile, setPreviewSrc, setIsPreviewAvailable, navigate, setErrorMsg) => {
    try {
      if (!file) {
        setErrorMsg('Please select a file to add.');
        return;
      }
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', listing.title);
      formData.append('description', listing.description);
      formData.append('location', listing.location);
  
      await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setFile(null);
      setPreviewSrc('');
      setIsPreviewAvailable(false);
      navigate('/');
    } catch (error) {
      console.error('Error in form submission:', error);
      setErrorMsg('Error submitting the form. Please try again.');
    }
  };

export const truncateDescription = (description, wordCount) => {
  const words = description.split(' ');
  const truncatedWords = words.slice(0, wordCount);
  return truncatedWords.join(' ') + (words.length > wordCount ? '...' : '');
};
export const fetchCombinedListings = async (setCombinedListings, setError) => {
    try {
      const response = await axios.get(`${API_URL}/listings`);
      const mongodbListings = response.data;
    
      setCombinedListings([...mongodbListings, ...localListings]);
      setError(null); // Clear the error if the request is successful
    } catch (error) {
      console.log('Error fetching listings:', error);
      setError('Error fetching listings. Please try again.');
    }
  };
  
  export const deleteListing = async (listingId, setCombinedListings, navigate, setShowDeleteModal) => {
    try {
      await axios.delete(`${API_URL}/listings/${listingId}`);
      setCombinedListings((prevListings) => prevListings.filter((listing) => listing._id !== listingId));
      console.log('Listing deleted successfully!');
      setShowDeleteModal(false);
      navigate('/');
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  export const handleDeleteListing = async (listingId) => {
    try {
      // Delete the listing on the server
      const response = await axios.delete(`${API_URL}/listings/${listingId}`);
  
      if (response.status === 200) {
        console.log('Listing deleted successfully:', response.data);
        return true; 
      } else {
        console.error('Failed to delete listing');
        return false; 
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error; 
    }
  };

import axios from 'axios';

// Define the API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL;

// Function to fetch information about a single listing
export const fetchListingInfo = async (id) => {
  try {
    // Send GET request to fetch listing info
    const response = await axios.get(`${API_URL}/listings/${id}`);
    return response.data; // Return the data if successful
  } catch (error) {
    throw error; // Throw the error for the caller to handle
  }
};

// Function to fetch listings from MongoDB
export const fetchMongoDBListings = async () => {
  try {
    // Send GET request to fetch listings
    const response = await axios.get(`${API_URL}/listings`);
    return response.data; // Return the data if successful
  } catch (error) {
    throw error; // Throw the error for the caller to handle
  }
};

// Function to truncate description of a listing
export const truncateDescription = (description, wordCount) => {
  const words = description.split(' ');
  const truncatedWords = words.slice(0, wordCount);
  return truncatedWords.join(' ') + (words.length > wordCount ? '...' : '');
};

// Function to handle input change event
export const onChange = (e, listing, setListing) => {
  setListing({ ...listing, [e.target.name]: e.target.value });
};

// Function to create a new listing
export const createListing = async (file, listing, setFile, setPreviewSrc, setIsPreviewAvailable, navigate, setErrorMsg) => {
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

    // Send POST request to create new listing
    await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Reset form state and navigate to home page
    setFile(null);
    setPreviewSrc('');
    setIsPreviewAvailable(false);
    navigate('/');
  } catch (error) {
    throw error; // Throw the error for the caller to handle
  }
};

// Function to handle submission of updated listing
export const handleSubmitUpdate = async (id, formData, file, listing, setFile, setPreviewSrc, navigate) => {
  try {
    let oldListingId;
    let uploadResponse; 

    if (file && listing.cloudinaryUrl) {
      // If there's a new file, upload it first
      uploadResponse = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Prepare data for updating the listing
      const data = {
        title: listing.title,
        description: listing.description,
        location: listing.location,
        cloudinaryUrl: uploadResponse.data.cloudinaryUrl,
      };

      // Send PUT request to update the listing
      const updateResponse = await axios.put(`${API_URL}/listings/${id}`, data);

      oldListingId = id;

      // Delete the old listing
      await handleDeleteListing(oldListingId);

    } else {
      // Prepare data for updating the listing
      const data = {
        title: listing.title,
        description: listing.description,
        location: listing.location,
        cloudinaryUrl: listing.cloudinaryUrl,
      };

      // Send PUT request to update the listing
      const updateResponse = await axios.put(`${API_URL}/listings/${id}`, data);
    }

    // Navigate to home page after successful update
    navigate('/');
  } catch (error) {
    throw error; // Throw the error for the caller to handle
  }
};

// Function to handle deletion of a listing
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
    throw error; // Throw the error for the caller to handle
  }
};

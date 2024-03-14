// frontendAppStore.js
import axios from 'axios';
import localListings from '../data/localListings.json';  // Add this line


export const API_URL = 'https://react-listings.onrender.com';
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

export const updateListingInfo = async (id, listing, file, navigate, setFile) => {
  try {
    if (file) {
      // Extract public ID from the existing cloudinaryUrl
      const publicId = listing.cloudinaryUrl.split("/").slice(-2, -1)[0];

      // Delete the old image from Cloudinary
      if (publicId) {
        const deleteImageResponse = await axios.delete(
          `${CLOUDINARY_BASE_URL}/resources/image/upload/${publicId}`,
          {
            auth: {
              username: CLOUDINARY_API_KEY,
              password: CLOUDINARY_API_SECRET,
            },
          }
        );
        console.log('Old image deleted from Cloudinary:', deleteImageResponse.data);
      }

      // Upload the new image to Cloudinary
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await axios.post(`${CLOUDINARY_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        auth: {
          username: CLOUDINARY_API_KEY,
          password: CLOUDINARY_API_SECRET,
        },
      });

      const data = {
        title: listing.title,
        description: listing.description,
        location: listing.location,
        cloudinaryUrl: uploadResponse.data.public_id,
      };

      console.log('Data being sent for update:', data);

      // Update the listing with the new data
      const updateResponse = await axios.put(`${API_URL}/listings/${id}`, data);

      console.log('Listing updated successfully:', updateResponse.data);
      navigate('/');
    } else {
      // If no new file is selected, only update title, description, and location
      const data = {
        title: listing.title,
        description: listing.description,
        location: listing.location,
      };

      console.log('Data being sent for update:', data);

      // Update the listing with the existing data
      const updateResponse = await axios.put(`${API_URL}/listings/${id}`, data);

      // Handle the update response as needed
      console.log('Listing updated successfully:', updateResponse.data);
      navigate('/');
    }

  } catch (error) {
    console.error('Error updating or deleting listing:', error);
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

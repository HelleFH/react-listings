import axios from 'axios';
import { API_URL } from '../utils/constants';
import localListings from '../data/localListings.json';


export const fetchListingInfo = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/listings/${id}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching listing information:', error);
    return null; 
  }
};

export const truncateDescription = (description, wordCount) => {
  const words = description.split(' ');
  const truncatedWords = words.slice(0, wordCount);
  return truncatedWords.join(' ') + (words.length > wordCount ? '...' : '');
};

export const onChange = (e, listing, setListing) => {
  setListing({ ...listing, [e.target.name]: e.target.value });
};

export const fetchCombinedListings = async (setCombinedListings, setError) => {
  try {
    const response = await axios.get(`${API_URL}/listings`);
    const mongodbListings = response.data;
  
    setCombinedListings([...mongodbListings, ...localListings]);
    setError(null); 
  } catch (error) {
    console.log('Error fetching listings:', error);
    setError('Error fetching listings. Please try again.');
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

export const handleSubmit = async (id, formData, file, listing, setFile, setPreviewSrc, navigate) => {
  try {
    let oldListingId;
    let uploadResponse; 

    if (file && listing.cloudinaryUrl) {
      const publicIdToDelete = listing.cloudinaryUrl.split('/').pop().split('.')[0];
      await deleteCloudinaryImage(publicIdToDelete);

      uploadResponse = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = {
        title: listing.title,
        description: listing.description,
        location: listing.location,
        cloudinaryUrl: uploadResponse.data.cloudinaryUrl,
      };

      const updateResponse = await axios.put(`${API_URL}/listings/${id}`, data);

      oldListingId = id;
    } else {
      const data = {
        title: listing.title,
        description: listing.description,
        location: listing.location,
        cloudinaryUrl: listing.cloudinaryUrl,
      };

      const updateResponse = await axios.put(`${API_URL}/listings/${id}`, data);
    }

    if (oldListingId) {
      await handleDeleteListing(oldListingId);
    }

    navigate('/');
  } catch (error) {
    console.error('Error updating or deleting listing:', error);
  }
};

export const deleteCloudinaryImage = async (publicIdToDelete) => {
  try {
    if (publicIdToDelete) {
      const response = await axios.delete(`${API_URL}/delete-image/${publicIdToDelete}`);
      console.log('Cloudinary image deletion response:', response.data);
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};

export const deleteListing = async (listingId) => {
  try {
    const response = await axios.delete(`${API_URL}/listings/${listingId}`);
    console.log('Listing deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
};

export const handleDeleteListing = async (listingId, setCombinedListings, setShowDeleteModal) => {
  try {
    // Delete the listing on the server
    await axios.delete(`${API_URL}/listings/${listingId}`);

    // Update combinedListings state by removing the deleted listing
    setCombinedListings((prevListings) => prevListings.filter(listing => listing._id !== listingId));

    setShowDeleteModal(false);

    console.log('Listing deleted successfully');
  } catch (error) {
    console.error('Error deleting listing:', error);
  }
};

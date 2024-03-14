import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ImageUpload from '../components/imageUpload';
import { fetchListingInfo, updateListingInfo } from '../store/appStore';
import axios from 'axios';
import { API_URL } from '../utils/constants';

// Function to delete Cloudinary image
const deleteCloudinaryImage = async (publicIdToDelete) => {
  try {
    if (publicIdToDelete) {
      const response = await axios.delete(`${API_URL}/delete-image/${publicIdToDelete}`);
      console.log('Cloudinary image deletion response:', response.data);
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    // Handle error if needed
  }
};
const handleDeleteListing = async (listingId) => {
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
function UpdateListingInfo() {
  const dropRef = useRef();
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');

  const [listing, setListing] = useState({
    title: '',
    description: '',
    location: '',
    cloudinaryUrl: '',
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchListingInfo(id, setListing, setPreviewSrc);
  }, [id]);

  const onDrop = (acceptedFiles) => {
    const currentFile = acceptedFiles[0];
    setFile(currentFile);

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setPreviewSrc(reader.result);
    });

    reader.readAsDataURL(currentFile);
  };

  const onChange = (e) => {
    setListing({ ...listing, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let oldListingId;
  
      if (file && listing.cloudinaryUrl) {
        // Extract the public ID from the existing cloudinaryUrl
        const publicIdToDelete = listing.cloudinaryUrl.split('/').pop().split('.')[0];
        console.log('Public ID to delete:', publicIdToDelete);
  
        // Delete the old image from Cloudinary
        await deleteCloudinaryImage(publicIdToDelete);
  
        const formData = new FormData();
        formData.append('file', file);
  
        formData.append('title', listing.title);
        formData.append('description', listing.description);
        formData.append('location', listing.location);
  
        // Upload the new image
        const uploadResponse = await axios.post(`${API_URL}/upload`, formData, {
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
  
        console.log('Data being sent for update:', data);
  
        // Update the listing with the new data
        const updateResponse = await axios.put(`${API_URL}/listings/${id}`, data);
  
        console.log('Listing updated successfully:', updateResponse.data);
  
        // Retrieve the old listing's ID
        oldListingId = id;
      } else {
        // If no new file is selected, only update title and description
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
      }
  
      // Delete the old listing if a new image was uploaded
      if (oldListingId) {
        await handleDeleteListing(oldListingId);
      }
  
      navigate('/');
    } catch (error) {
      console.error('Error updating or deleting listing:', error);
    }
  };
  
  
  return (
    <div className='UpdateListingInfo'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-8 m-auto'>
            <br />
            <Link to='/' className='btn btn-outline-warning float-left'>
              Show Book List
            </Link>
          </div>
          <div className='col-md-8 m-auto'>
            <h1 className='display-4 text-center'>Edit Listing</h1>
            <p className='lead text-center'>Update Listing's Info</p>
          </div>
        </div>

        <div className='col-md-8 m-auto'>
          <form noValidate onSubmit={onSubmit}>
            <ImageUpload
              onDrop={onDrop}
              file={file}
              previewSrc={previewSrc}
              isPreviewAvailable={true}
            />
            <div className='form-group'>
              <label htmlFor='title'>Title</label>
              <input
                type='text'
                name='title'
                className='form-control'
                value={listing.title}
                onChange={onChange}
              />
            </div>

            <br />
            <div className='form-group'>
              <label htmlFor='description'>Description</label>
              <textarea
                type='text'
                placeholder='Description of the Listing'
                name='description'
                className='form-control'
                value={listing.description}
                onChange={onChange}
              />
            </div>
            <br />
            <div className='form-group'>
              <label htmlFor='location'>Location</label>
              <input
                type='text'
                name='location'
                className='form-control'
                value={listing.location}
                onChange={onChange}
              />
            </div>
            <button
              type='submit'
              className='btn button button--orange btn-lg btn-block float right'
            >
              Update Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateListingInfo;

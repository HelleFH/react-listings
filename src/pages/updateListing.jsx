import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ImageUpload from '../components/imageUpload';
import { handleDeleteListing } from '../components/handleDeleteListing';
import axios from 'axios';

function UpdateListingInfo() {
  const dropRef = useRef();
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;


   const fetchListingInfo = async (id) => {
    try {
      // Send GET request to fetch listing info
      const response = await axios.get(`${API_URL}/listings/${id}`);
      return response.data; // Return the data if successful
    } catch (error) {
      throw error; // Throw the error for the caller to handle
    }
  };

   const onChange = (e, listing, setListing) => {
    setListing({ ...listing, [e.target.name]: e.target.value });
  };

  

  const [listing, setListing] = useState({
    title: '',
    description: '',
    location: '',
    cloudinaryUrl: '',
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const handleSubmitUpdate = async (id, formData, file, listing, setFile, setPreviewSrc, navigate) => {
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
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchListingInfo(id);
        if (data) {
          setListing(data); // Update the listing state with the fetched data
          setPreviewSrc(data.cloudinaryUrl); // Set the preview source with the fetched cloudinaryUrl
        } else {
          console.error('Listing data is undefined');
        }
      } catch (error) {
        console.error('Error fetching listing information:', error);
      }
    };
  
    fetchData();
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

  const handleChange = (e) => {
    onChange(e, listing, setListing); // Handle change in input fields
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', listing.title);
    formData.append('description', listing.description);
    formData.append('location', listing.location);

    await handleSubmitUpdate(id, formData, file, listing, setFile, setPreviewSrc, navigate);
  };

  

  return (
    <div className='UpdateListingInfo'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-8 m-auto'>
            <br />
            <Link to='/' className='btn btn-outline-warning  mb-5 btn btn-outline-warning float-right float-left'>
              Back to Listings
            </Link>
          </div>
          <div className='col-md-8 m-auto'>
            <h1 className='display-4 text-center'>Edit Listing</h1>
            <p className='lead text-center'>Update Listing's Info</p>
          </div>
        </div>

        <div className='col-md-8 m-auto'>
          <form noValidate onSubmit={handleSubmitForm}>
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
              />
            </div>
            <button
              type='submit'
              className='btn button button--orange btn-lg btn-block float-end mt-4'
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateListingInfo;

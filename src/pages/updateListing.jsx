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

      const response = await axios.get(`${API_URL}/listings/${id}`);
      return response.data;
    } catch (error) {
      throw error; 
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
  
        await handleDeleteListing(oldListingId);
  
      } else {
        const data = {
          title: listing.title,
          description: listing.description,
          location: listing.location,
          cloudinaryUrl: listing.cloudinaryUrl,
        };
  
        const updateResponse = await axios.put(`${API_URL}/listings/${id}`, data);
      }
  
      navigate('/');
    } catch (error) {
      throw error; 
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchListingInfo(id);
        if (data) {
          setListing(data); 
          setPreviewSrc(data.cloudinaryUrl); 
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
    onChange(e, listing, setListing);
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

import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import ImageUpload from '../components/imageUpload';
import axios from 'axios';
const CreateListingWithFileUpload = () => {
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;


  const [listing, setListing] = useState({
    title: '',
    description: '',
    location: '',
  });

  const onDrop = (files) => {
    const [uploadedFile] = files;
    setFile(uploadedFile);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewSrc(fileReader.result);
    };
    fileReader.readAsDataURL(uploadedFile);
    setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
  };

  const createListing = async (file, listing, setFile, setPreviewSrc, setIsPreviewAvailable, navigate, setErrorMsg) => {
    try {
      const formData = new FormData();
      
      // Conditionally append the file if it exists
      if (file) {
        formData.append('file', file);
      }
      
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
      setErrorMsg(error.message); // Set the error message to display it in the UI
      console.error('Error creating listing:', error); // Log the error to the console for debugging
    }
  };

  const handleListingSubmit = async (e) => {
    e.preventDefault();
    try {
      await createListing(file, listing, setFile, setPreviewSrc, setIsPreviewAvailable, navigate, setErrorMsg);
    } catch (error) {
      setErrorMsg('Failed to create listing. Please try again later.');
    }
  };

  const handleInputChange = (event) => {
    setListing({
      ...listing,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      <Link to='/'>
        <button className='button mt-3 mb-3 btn btn-outline-warning float-right'>
          Back to Listings
        </button>
      </Link>
      <Form className="search-form" onSubmit={handleListingSubmit} encType="multipart/form-data">
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        <ImageUpload
          onDrop={onDrop}
          file={file}
          previewSrc={previewSrc}
          isPreviewAvailable={isPreviewAvailable}
        />
        <div className='form-container'>
          <div className="form-group">
            <input
              type="text"
              placeholder="Title"
              name="title"
              className="form-control"
              value={listing.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Description"
              name="description"
              className="form-control"
              value={listing.description}
              onChange={handleInputChange}
              style={{ height: '150px', verticalAlign: 'top' }}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Location"
              name="location"
              className="form-control"
              value={listing.location}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className='d-flex w-100 float-right justify-content-end gap-2'>
          <Link to="/" className="mt-4 mb-4 w-25 button button--blue">
            Cancel
          </Link>
          <button className="mt-4 mb-4 w-25 button button--orange" type="submit">
            Submit
          </button>
        </div>
      </Form>
    </>
  );
};

export default CreateListingWithFileUpload;
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateListingWithFileUpload from '../pages/createListing';
import ShowListingList from '../pages/showListingList'
import UpdateListingInfo from '../pages/updateListing';
import IndividualPage from '../pages/individualPage'; 
import Navbar from '../components/Navbar';

const AppRouter = () => (
  <Router>
    <Navbar />
    <div className="container">
      <div className="main-content">
        <Routes>
          <Route path="/" element={<ShowListingList />} />
          <Route path="/create-listing" element={<CreateListingWithFileUpload />} />
          <Route path="/edit-listing/:id" element={<UpdateListingInfo />} />
          <Route path="/listing/:id" element={<IndividualPage />} />
        </Routes>
      </div>
    </div>
  </Router>
);

export default AppRouter;
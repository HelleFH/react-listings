import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateListingWithFileUpload from '../pages/createListing';
import ShowListingList from '../pages/ShowListingList';
import UpdateListingInfo from '../pages/updateListing';
import DetailPage from '../pages/IndividualPage';
import Header from '../components/Header'; 


const AppRouter = () => (
  <Router>
    <Header />
    <div className="container">
      <div className="main-content">
        <Routes>
          <Route path="/" element={<ShowListingList />} />
          <Route path="/create-listing" element={<CreateListingWithFileUpload />} />
          <Route path="/edit-listing/:id" element={<UpdateListingInfo />} />
          <Route path="/listing/:id" element={<DetailPage />} />
        </Routes>
      </div>
    </div>
  </Router>
);

export default AppRouter;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#ffc107' }}>
      <div className="container-fluid">
        {/* Removed navbar-brand */}
        <button
          className="navbar-toggler mb-3"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarSupportedContent"
          aria-expanded={isOpen ? "true" : "false"}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 w-100"
              style={{ 
                backgroundColor: '#ffc107', 
                paddingLeft: '1em', 
                zIndex: 1000,
                position: 'absolute',
                left: isOpen ? 0 : '-100%'
              }}
          >
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/" onClick={() => navigate("/")} style={{ color: '#000000', fontSize: '1.25rem' }}>
                <h5>Home</h5>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/create-listing" onClick={() => navigate("/create-listing")} style={{ color: '#000000', fontSize: '1.25rem' }}>
                <h5>Add New Listing</h5>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
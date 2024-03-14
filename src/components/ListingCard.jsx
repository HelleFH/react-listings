import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function ListingCard({ listing, onDelete }) {
  const handleDelete = (e) => {
    e.stopPropagation(); // Prevents the click event from propagating to the parent link
    onDelete(listing._id, listing.cloudinaryPublicId, listing.cloudinaryDeleteToken);
  };

  return (
    <div className='card mb-3'>
      {/* Use the Cloudinary URL for the image */}
      <Link to={`/listing/${listing._id}`} className="card-link">
        <img
          src={listing.cloudinaryUrl}
          alt={`Listing cover for ${listing.title}`}
          className='card-img-top'
        />
      </Link>
      <div className='card-body'>
        <h5 className='card-title' style={{ height: '40px', whiteSpace:'nowrap' }}>{listing.title}</h5>
        <p className='card-location fw-bold mt-2 mb-2'>{listing.location}</p>
        <p className='card-description mb-3' style={{ height: '70px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {listing.description}
        </p>
        <div className='d-flex justify-content-end width-100 mt-4'>
          <button
            onClick={(e) => handleDelete(e)}
            className='button button--blue'
            style={{ marginRight: '10px' }}
          >
            Delete Listing
          </button>
          <Link
            to={`/edit-listing/${listing._id}`}
            className='button button--orange '
          >
            Edit Listing
          </Link>
        </div>
      </div>
    </div>
  );
}

ListingCard.propTypes = {
  listing: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    cloudinaryPublicId: PropTypes.string, // Include Cloudinary public ID
    cloudinaryDeleteToken: PropTypes.string, // Include Cloudinary delete token
    cloudinaryUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ListingCard;

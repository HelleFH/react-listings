import { NavLink, useNavigate } from "react-router-dom";


const Header = () => {
  const navigate = useNavigate();

  return (
    <header style={{ backgroundColor: "#ffc107", color: "#F0F0F0" , fontSize:'18px'}} className="mb-5 z-10 border-b-[1px] sticky top-0 text-black backdrop-blur-lg px-5 py-2 flex items-center justify-between">
      <div>
        <div className="flex justify-center items-center gap-2" onClick={() => navigate("/")}>
        </div>
      </div>
      <div className="hidden sm:block">
        <ul className=" d-flex flex-row list-unstyled justify-content-between items-center align-items-center mb-0 p-3 ml-2 mr-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "text-black" : "")}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/create-listing"
              className={({ isActive }) => (isActive ? "text-black" : "")}
            >
              Add New Listing
            </NavLink>
          </li>
        
        </ul>
      </div>
      
    </header>
  );
};

export default Header;

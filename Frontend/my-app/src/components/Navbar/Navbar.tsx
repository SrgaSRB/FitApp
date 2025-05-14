import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => (
  <section className="navbar-section">
    <div className="container w-container">
      <div className="navbar-wrapper">
        <div className="div-block">

          <NavLink to="/home" style={{textDecoration : "none"}}>
            {({ isActive }) => (
              <div className={`link-block w-inline-block ${isActive ? "nav-selected" : ""}`}>
                <img
                  src={isActive ? "assets/icons/home-black.png" : "assets/icons/home-white.png"}
                  alt="New Workout Icon"
                  className="image-4"
                />
                <div className="text-block">Početna</div>
              </div>
            )}
          </NavLink>

          <NavLink to="/new-workout"style={{textDecoration : "none"}}>
            {({ isActive }) => (
              <div className={`link-block w-inline-block ${isActive ? "nav-selected" : ""}`}>
                <img
                  src={isActive ? "assets/icons/plus-black.png" : "assets/icons/plus-white.png"}
                  alt="New Workout Icon"
                  className="image-4"
                />
                <div className="text-block">Novi trening</div>
              </div>
            )}
          </NavLink>


          <NavLink to="/progress" style={{textDecoration : "none"}}>
            {({ isActive }) => (
              <div className={`link-block w-inline-block ${isActive ? "nav-selected" : ""}`}>
                <img
                  src={isActive ? "assets/icons/analytics-black.png" : "assets/icons/analytics-white.png"}
                  alt="New Workout Icon"
                  className="image-4"
                />
                <div className="text-block">Napredak</div>
              </div>
            )}
          </NavLink>

          <NavLink to="/profile" style={{textDecoration : "none"}}>
            {({ isActive }) => (
              <div className={`link-block w-inline-block ${isActive ? "nav-selected" : ""}`}>
                <img
                  src={isActive ? "assets/icons/user-black.png" : "assets/icons/user-white.png"}
                  alt="New Workout Icon"
                  className="image-4"
                />
                <div className="text-block">Profil</div>
              </div>
            )}
          </NavLink>

        </div>
      </div>
    </div>
  </section>
);

export default Navbar;

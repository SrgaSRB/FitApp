import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => (
  <section className="navbar-section">
    <div className="container w-container">
      <div className="navbar-wrapper">
        <div className="div-block">
          <NavLink
            to="/home"
            end            
            className={({ isActive }) =>
              `link-block w-inline-block ${isActive ? "nav-selected" : ""}`
            }>
            <div className="text-block">Početna</div>
          </NavLink>

          <NavLink
            to="/new-workout"
            className={({ isActive }) =>
              `link-block w-inline-block ${isActive ? "nav-selected" : ""}`
            }>
            <div className="text-block">Novi trening</div>
          </NavLink>

          <NavLink
            to="/progress"
            className={({ isActive }) =>
              `link-block w-inline-block ${isActive ? "nav-selected" : ""}`
            }>
            <div className="text-block">Napredak</div>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `link-block w-inline-block ${isActive ? "nav-selected" : ""}`
            }>
            <div className="text-block">Profil</div>
          </NavLink>
        </div>
      </div>
    </div>
  </section>
);

export default Navbar;

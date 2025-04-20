import React from 'react';
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="nav-logo">
          Search Algorithms & Games
        </div>
        <ul className="nav-links">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'active' : ''}
              end
            >
              Search Algorithms
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/draughts" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Draughts Game
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;

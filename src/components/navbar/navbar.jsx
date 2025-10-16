import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import style from './navbar.module.scss';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Use event-based update for login state (in case other tabs log in/out)
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate('/login');
  };

  return (
    <nav className={style.navbar}>
      <div className={style.logo} onClick={() => navigate('/home')}>
        MyApp
      </div>

      {/* ✅ Mobile menu toggle */}
      <div className={`${style.links} ${showMenu ? style.mobileMenu : ''}`}>
        {['/home', '/about', '/addclass', '/schedule'].map((path, index) => {
          const label = path.slice(1).charAt(0).toUpperCase() + path.slice(2);
          return (
            <div className={style.linkWrapper} key={index}>
              <NavLink
                to={path}
                className={({ isActive }) => (isActive ? style.active : '')}
                onClick={() => setShowMenu(false)}
              >
                {label}
              </NavLink>
            </div>
          );
        })}
      </div>

      {/* ✅ Profile + Dropdown */}
      <div className={style.profile}>
        <button
          className={style.icon}
          onClick={() => setShowDropdown((prev) => !prev)}
          aria-label="Profile Menu"
        >
          <FaUserCircle size={28} />
        </button>

        {showDropdown && (
          <div className={style.dropdown}>
            <Link to="/profile" onClick={() => setShowDropdown(false)}>
              Profile
            </Link>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className={style.logoutButton}
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setShowDropdown(false)}>
                  Login
                </Link>
                <Link to="/signup" onClick={() => setShowDropdown(false)}>
                  Signup
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* ✅ Hamburger menu */}
      <div
        className={style.menuIcon}
        onClick={() => setShowMenu((prev) => !prev)}
      >
        {showMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { GlobalContext } from '../context';
import './nav.css';

function Nav() {
  let { getGlobal: { isLoggedin, image }, setGlobal } = useContext(GlobalContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const logoutHandler = () => {
    setGlobal({
      isLoggedin: false,
      username: null,
      phone: null,
      image: null,
      email: null,
      price: null,
    });
    localStorage.removeItem('token');
    toast.success('Logged out!');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Toaster position="top-center" />
      <a className="navbar-brand" href="#" onClick={() => navigate('/')}>
        <img src="/logo.png" alt="logo" className="logo" />
      </a>

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        {isLoggedin ? (
          <ul className="navbar-nav ml-auto">
            <li className={`nav-item ${pathname === '/profile' ? 'active' : ''}`}>
              <a className="nav-link" href="#" onClick={() => navigate('/profile')}>
                <img src={image} alt="profile" className="profile" />
              </a>
            </li>
            {pathname === '/profile' && (
              <>
                <li className={`nav-item ${pathname === '/cart' ? 'active' : ''}`}>
                  <a className="nav-link" href="#" onClick={() => navigate('/cart')}>
                    Cart
                  </a>
                </li>
                <li className={`nav-item ${pathname === '/add-products' ? 'active' : ''}`}>
                  <a className="nav-link" href="#" onClick={() => navigate('/add-products')}>
                    Add Products
                  </a>
                </li>
              </>
            )}
            <li className="nav-item">
              <button className="nav-link" onClick={logoutHandler}>
                Logout
              </button>
            </li>
          </ul>
        ) : (
          <ul className="navbar-nav ml-auto">
            {pathname !== '/register' && (
              <li className={`nav-item ${pathname === '/register' ? 'active' : ''}`}>
                <a className="nav-link" href="#" onClick={() => navigate('/register')}>
                  Register
                </a>
              </li>
            )}
            {pathname !== '/login' && (
              <li className={`nav-item ${pathname === '/login' ? 'active' : ''}`}>
                <a className="nav-link" href="#" onClick={() => navigate('/login')}>
                  Login
                </a>
              </li>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Nav;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        setProfileData(response.data.user);
        setProducts(response.data.products);
        console.log(response.data.products);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      {loading && <p>Loading...</p>}
      {profileData && (
        <div className="profile-details">

          <div className="row">

            <div className="col-lg-4 col-md-6 col-sm-12" style={{ textAlign: 'center', paddingTop: '50px' }}>
              <img src={profileData.image} style={{ height: '400px', width: '400px' }} alt="Profile" className="profile-image" />
            </div>

            <div className="col-lg-8 col-md-6 col-sm-12">
              <table style={{ marginTop: '100px' }}>
                <tbody>

                  <tr>
                    <td style={{ verticalAlign: 'top' }}><h2>Username</h2> </td>
                    <td style={{ verticalAlign: 'top' }}><h2>:</h2></td>
                    <td style={{ verticalAlign: 'top' }}><h2>{profileData.username}</h2> </td>
                  </tr>

                  <tr>
                    <td style={{ verticalAlign: 'top' }}><h2>Email</h2> </td>
                    <td style={{ verticalAlign: 'top' }}><h2>:</h2></td>
                    <td style={{ verticalAlign: 'top' }}><h2>{profileData.email}</h2> </td>
                  </tr>

                  <tr>
                    <td style={{ verticalAlign: 'top' }}><h2>Phone</h2> </td>
                    <td style={{ verticalAlign: 'top' }}><h2>:</h2></td>
                    <td style={{ verticalAlign: 'top' }}><h2>{profileData.phone}</h2> </td>
                  </tr>

                </tbody>
              </table>

            </div>

          </div>



          <h2 style={{paddingTop:'50px'}}>Your Products</h2>
          <div className="row list-row">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div key={index} className="col-lg-3 col-md-6 col-sm-12 list-col">
                <div className="product-list">
                  <div className="product-upper">
                    <img className='product-image' src={product.thumbnail} alt={product.title} />
                  </div>
                  <div className="product-down">
                    <h2 className='product-title'>{product.title}</h2>

                    <Link to={`/product/${product._id}`} className='product-view'>View</Link>
                  </div>
                </div>
              </div>
            ))) : (
              <p>No products found.</p>
            )}          
  
          </div>

        </div>
      )}
    </div>
  );
}

export default Profile;

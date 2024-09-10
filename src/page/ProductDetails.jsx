import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
  import axios from 'axios';

const ProductDetails = () => {
  const { productId } = useParams();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [uploader, setUploader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [displayedImage, setDisplayedImage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("ue");
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          alert('Please register or login');
          navigate('/register');
          return;
        }

        const [productResponse, imagesResponse] = await Promise.all([
          axios.get(`/api/view-product/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/uploaded-images/${productId}`),
        ]);

        const { product, user: productUser, userId } = productResponse.data;
        setProduct(product);
        setUser(productUser);
        setUploader(userId.userId);
        setUploadedImages(imagesResponse.data.imagePaths);
        // setSelectedImageIndex(0);
        setDisplayedImage(getImagePath(imagesResponse.data.imagePaths[selectedImageIndex]));
        console.log(selectedImageIndex);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedImageIndex]);

  const handleAddToCart = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      const data = {
        productId: product?._id,
      };

      const response = await axios.post('/api/add-to-cart', data, config);

      if (response.status === 200) {
        alert('Successfully added to cart!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart.');
    }
  };

  const handleDeleteProduct = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Please register or login');
        navigate('/register');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.delete(`/api/delete-product/${productId}`, config);

      if (response.status === 200) {
        alert('Product deleted successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!product) {
    return <p>Product not found</p>;
  }


  console.log(displayedImage);

  const isUploader = uploader === product.userId;

  return (
    <div className='row' style={{ margin: '50px', backgroundColor: 'white', height: '80vh' }}>
      {/* Thumbnails */}
      <div className='col-lg-2' style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '100px' }}>

        {uploadedImages.map((image, index) => (
          <img
            key={index}
            src={getImagePath(image)}
            alt={`Product ${index + 1}`}
            style={{
              width: '80px',
              height: '80px',
              margin: '10px',
              cursor: 'pointer',
              border: selectedImageIndex === index ? '5px solid #2874f0' : 'none',
              borderRadius: '4px',
            }}
            onClick={() => setSelectedImageIndex(index)}
          />
        ))}
      </div>

      {/* Product Images */}
      <div className='col-lg-5' style={{ textAlign: 'center' }}>
        <img
          src={displayedImage}
          alt={product.title}
          style={{ width: '500px ', height: '500px', margin: '100px', borderRadius: '4px' }}
        />
      </div>

      {/* Product Details */}
      <div className='col-lg-5' style={{ padding: '20px', paddingTop: '100px' }}>
        <table style={{ width: '100%', paddingTop: '100px' }}>
          <tbody>
            <tr>
              <td colSpan="2" style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                <h1>{product.title}</h1>
              </td>
            </tr>

            <tr>
              <td style={{ verticalAlign: 'top' }}><h2>Description</h2> </td>
              <td style={{ verticalAlign: 'top' }}><h2>:</h2></td>
              <td style={{ verticalAlign: 'top' }}><h2>{product.description}</h2> </td>
            </tr>


            <tr>
              <td style={{ verticalAlign: 'top' }}><h2>Stock</h2></td>
              <td style={{ verticalAlign: 'top' }}><h2>:</h2></td>
              <td style={{ verticalAlign: 'top' }}> <h2>{product.stock}</h2></td>
              </tr>

              <tr> 
              <td style={{ verticalAlign: 'top' }}>  <h2>Username</h2></td>
              <td style={{ verticalAlign: 'top' }}><h2>:</h2></td>
              <td style={{ verticalAlign: 'top' }}>  <h2>{user?.username}</h2>   </td>
            
            </tr>

              <tr>
              <td style={{ verticalAlign: 'top' }}><h2>Category</h2></td>
              <td style={{ verticalAlign: 'top' }}><h2>:</h2></td>
              <td style={{ verticalAlign: 'top' }}> <h2>{product.category}</h2></td>
              </tr>
            
            <tr>
              <td style={{ verticalAlign: 'top' }}><h2>Price</h2></td>
              <td style={{ verticalAlign: 'top' }}><h2>:</h2></td>
              <td style={{ verticalAlign: 'top' }}> <h2>{product.price}</h2></td>
             </tr>



            <tr>
              <td colSpan="2">
                <button
                  onClick={isUploader ? handleDeleteProduct : handleAddToCart}
                  style={{
                    backgroundColor: isUploader ? '#ff4646' : '#f0c14b',
                    padding: '10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '10px',
                  }}
                >
                  {isUploader ? 'Delete Product' : 'Add to Cart'}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ProductDetails;

function getImagePath(image) {
  return image ? image.replace(/\\/g, '/').split('/e-commerce-app')[1] : '';
}

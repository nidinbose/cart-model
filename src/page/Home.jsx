import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import "./style/home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/get-products');
        setProducts(response.data.products);
        setLoading(false);
        console.log("products",response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching products.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className='container-fluid'>
      <div className="row list-row">
        {products?.map((product, index) => (
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
        ))}
      </div>
    </div>
  );
}

export default Home;

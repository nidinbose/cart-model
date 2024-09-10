import React, { useEffect, useState } from 'react';
import axios from 'axios';



const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get('/api/get-cart', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setCartItems(response.data.cartDetails);

      const firstUserId = response.data.cartDetails.length > 0
        ? response.data.cartDetails[0].userId
        : null;

      setUserId(firstUserId);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleIncrement = async (productId, userId, currentCount, currentPrice) => {
    try {
      const response = await axios.post('/api/increment-cart', {
        productId,
        userId,
      });

      if (response.status === 200) {
        alert('Successfully added to cart!');
      }

      fetchCartItems();
    } catch (error) {
      console.error('Error incrementing cart item count', error);
      alert('done with limit');
    }
  };

  const handleDecrement = async (productId, userId, currentCount, currentPrice) => {
    try {
      const response = await axios.post('/api/decrement-cart', {
        productId,
        userId,
      });

      if (response.status === 200) {
        alert(response.data.msg);
      }

      fetchCartItems();
    } catch (error) {
      console.error('Error decrementing cart item count:', error);
      alert(response.data.msg);
    }
  };

  const handleRemove = async (productId, userId) => {
    try {
      const response = await axios.post('/api/delete-cart-item', {
        productId,
        userId,
      });

      if (response.status === 200) {
        alert(response.data.message);
      }

      fetchCartItems();
    } catch (error) {
      console.error('Error removing cart item:', error);
      alert(response.data.message);
    }
  };

  const totalAmount = cartItems.reduce(
    (total, cartItem) => total + cartItem.count * cartItem.product.price,
    0
  );

  const handleBuyNow = async () => {
    try {
      
      const response = await axios.post('/api/buy-now', {
        userId,
      });

      if (response.status === 200) {
        alert(response.data.message);
      }
      fetchCartItems();
    } catch (error) {
      console.error('Error handling buy now', error);
      alert('Error handling buy now');
    }
  };


  return (
    <div style={styles.cartContainer}>
      <h2>Your Cart</h2>
      {loading && <p>Loading...</p>}
      {!loading && cartItems.length === 0 && <div style={styles.cartItem}><p>Your cart is empty.</p></div>}
      {!loading && cartItems.length > 0 && (
        <div>
          <ul style={styles.cartList}>
            {cartItems.map((cartItem) => (
              <li key={cartItem._id} style={styles.cartItem}>
                <div style={styles.cartItemImage}>
                  <img src={cartItem.product.thumbnail} alt={cartItem.product.title} style={styles.productImage} />
                </div>
                <div style={styles.cartItemDetails}>
                  <p style={styles.productTitle}>{cartItem.product.title}</p>
                  <p style={styles.productDescription}>{cartItem.product.description}</p>
                  <p style={styles.productPrice}>Actual Price: ${cartItem.product.price}</p>
                  <p style={styles.productPrice}>Price:{cartItem.count * cartItem.product.price}</p>
                  <div style={styles.quantityControls}>
                    <button style={styles.controlButton} onClick={() => handleDecrement(cartItem.productId, cartItem.userId)}>-</button>
                    <span style={styles.quantity}>{cartItem.count}</span>
                    <button style={styles.controlButton} onClick={() => handleIncrement(cartItem.productId, cartItem.userId)}>+</button>
                  </div>
                  <button style={styles.removeButton} onClick={() => handleRemove(cartItem.productId, cartItem.userId)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p style={styles.totalAmount}>
            <strong>Total Amount:</strong> ${totalAmount}
          </p>
          <button style={styles.buyNowButton} onClick={handleBuyNow}>
              Buy Now
            </button>
        </div>
      )}
    </div>
  );
};




const styles = {
  cartContainer: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundColor: '#f4f4f4',
  },
  cartList: {
    listStyle: 'none',
    padding: 0,
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    padding: '15px',
    height:' 500px',
  },
  cartItemImage: {
    marginRight: '15px',
  },
  productImage: {
    width: '500px',
    height: 'auto',
    height:'400px',
  },
  cartItemDetails: {
    flex: 1,
    padding:'100px',
  },
  productTitle: {
    fontSize: '50px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  productDescription: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  productPrice: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  controlButton: {
    cursor: 'pointer',
    fontSize: '18px',
    marginRight: '5px',
    padding: '5px 10px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
  },
  quantity: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '0 10px',
  },
  removeButton: {
    cursor: 'pointer',
    fontSize: '16px',
    padding: '8px 15px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
  },
  totalAmount: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginTop: '20px',
  },
  cartFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  buyNowButton: {
    cursor: 'pointer',
    fontSize: '18px',
    padding: '10px 20px',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
  },
};

export default Cart;

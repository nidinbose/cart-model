import path from 'path';
import fs from 'fs/promises';

import productsModel from '../models/products.model.js';
import userModel from '../models/user.model.js';
import cartModel from '../models/cart.model.js';
import jwt from 'jsonwebtoken';

export async function addProduct(req, res) {
  try {
    let { title, stock, description, thumbnail, category, price, userId } = req.body;
    let { images } = req.files;
    console.log("uerrrr", userId);
    // thumbnail = thumbnail[0].filename;
    images = images.map(item => item.filename);
    await productsModel.create({
      title,
      thumbnail,
      stock,
      description,
      images,
      category,
      price,
      userId
    })
    return res.status(201).json({
      msg: "Data resived!"
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error occured!"
    })
  }
}

export async function getProducts(req, res) {
  try {


    let { limit = 100, skip = 0, category, select } = req.query;

    limit = parseInt(limit, 10);
    skip = parseInt(skip, 10);

    const filter = category ? { category } : {};

    const projection = select ? { [select]: 1 } : {};

    const products = await productsModel.find(filter, projection)
      .limit(limit)
      .skip(skip)
    // .sort({ [sort]: 1 });

    if (products.length === 0) {
      return res.status(204).json({
        msg: "There are no products to show!",
        products: []
      });
    }

    return res.status(200).json({
      msg: `${products.length} Product(s) found`,
      products
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "An error occurred!",
      error: error.message
    });
  }
}



export async function viewProducts(req, res) {
  try {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ msg: 'JWT must be provided' });
    }

    const userId = jwt.verify(token, process.env.SECRET_KEY);
    req.user = userId;

    const { productId } = req.params;
    console.log(userId);

    let product = await productsModel.findOne({ _id: productId });
    // let name = product.images;

    // const filePath = path.resolve(`./uploaded-images/${name}`);
    // console.log(filePath);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    const user = await userModel.findOne({ _id: product.userId });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }



    return res.status(200).json({
      msg: 'Product found',
      product,
      user,
      userId,
      // filePath,
    });




  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'An error occurred!',
      error: error.message,
    });
  }
}


export async function addToCart(req, res) {
  const { productId } = req.body;
  const { userId } = req.user;
  console.log(productId, userId);

  try {

    const existingCartItem = await cartModel.findOne({ productId, userId });

    const product = await productsModel.findOne({ _id: productId });
    const actualProductCount = product ? product.stock : 0;

    if (existingCartItem) {
      if (existingCartItem.count < actualProductCount) {
        existingCartItem.count += 1;
        await existingCartItem.save();
        return res.status(200).json({ msg: 'Item added to cart successfully!' });
      } else {
        return res.status(400).json({ msg: 'Item count exceeds available stock.' });
      }
    } else {
      if (1 <= actualProductCount) {
        await cartModel.create({ productId, userId, count: 1 });
        return res.status(200).json({ msg: 'Item added to cart successfully!' });
      } else {
        return res.status(400).json({ msg: 'Item count exceeds available stock.' });
      }
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ msg: 'Error adding to cart.' });
  }
}


export async function getCart(req, res) {
  const { userId } = req.user;

  try {
    const cartItems = await cartModel.find({ userId });
    const productIds = cartItems.map(cartItem => cartItem.productId);

    const products = await productsModel.find({ _id: { $in: productIds } });

    if (!products) {
      return res.status(404).json({ msg: 'Products not found' });
    }

    const cartDetails = cartItems.map(cartItem => {
      const product = products.find(p => p._id.toString() === cartItem.productId.toString());
      return {
        ...cartItem._doc,
        product,
      };
    });

    res.status(200).json({
      msg: 'Cart details found',
      cartDetails,
    });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ msg: 'Error fetching cart items.' });
  }
}



export async function incrementCart(req, res) {
  const { productId, userId } = req.body;

  try {
    let cartItem = await cartModel.findOne({ productId, userId });

    if (cartItem) {
      const product = await productsModel.findOne({ _id: productId });
      const actualProductCount = product ? product.stock : 0;

      if (cartItem.count < actualProductCount) {
        cartItem.count += 1;
        await cartItem.save();
        return res.status(200).json({ msg: 'Item added to cart successfully!' });
      } else {
        return res.status(400).json({ msg: 'Item count exceeds available stock.' });
      }
    }

    res.status(404).json({ msg: 'Item not found in the cart.' });
  } catch (error) {
    console.error('Error incrementing cart item count:', error);
    res.status(500).json({ msg: 'Error incrementing cart item count.' });
  }
}




export async function decrementCart(req, res) {
  const { productId, userId } = req.body;
  console.log(req.body);
  try {
    let cartItem = await cartModel.findOne({ productId, userId });

    if (!cartItem) {
      return res.status(404).json({ msg: 'Cart item not found' });
    }


    if (cartItem.count > 1) {
      cartItem.count -= 1;
      await cartItem.save();

      res.status(200).json({ msg: 'Cart item count decremented successfully!' });
    } else {
      res.status(400).json({ msg: 'Cannot decrement count below 1' });
    }
  } catch (error) {
    console.error('Error decrementing cart item count:', error);
    res.status(500).json({ msg: 'Error decrementing cart item count.' });
  }
}



export async function deleteCartItem(req, res) {
  const { productId, userId } = req.body;

  try {
    const cartItem = await cartModel.findOne({ productId, userId });

    if (!cartItem) {
      return res.status(404).json({ msg: 'Cart item not found.' });
    }

    await cartModel.deleteOne({ productId, userId });

    res.status(200).json({ msg: 'Cart item deleted successfully.' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ msg: 'Error deleting cart item.' });
  }
}


export async function checkCart(req, res) {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const cartItem = await cartModel.findOne({ productId, userId });

    const isAddedToCart = Boolean(cartItem);

    res.status(200).json({ isAddedToCart });
  } catch (error) {
    console.error('Error checking if added to cart:', error);
    res.status(500).json({ msg: 'Error checking if added to cart.' });
  }
}



export async function deleteproduct(req, res) {
  const productId = req.params.productId;

  try {

    const deletedProduct = await productsModel.deleteOne({ _id: productId });
    const deleteCartProduct = await cartModel.deleteOne({ productId: productId });

    if (deletedProduct && deleteCartProduct) {
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}



export async function getimg(req, res) {
  try {
    const { productId } = req.params;
    console.log(productId);

    const product = await productsModel.findOne({ _id: productId });

    if (!product || !product.images || product.images.length === 0) {
      return res.status(404).json({ error: 'Images not found' });
    }

    const imagePromises = product.images.map(async (imageName) => {
      const filePath = path.resolve(`./uploaded-images/${imageName}`);
      console.log("path", filePath);

      try {
        await fs.access(filePath, fs.constants.R_OK);
        return filePath;
      } catch (error) {
        console.error('Error accessing image file:', error);
        throw new Error('Image not accessible');
      }
    });

    const imagePaths = await Promise.all(imagePromises);
    console.log("img path", imagePaths);

    res.status(200).json({
      msg: 'Images found',
      imagePaths,
    });

  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export async function removeCart(req, res) {
  try {
    const { productId, userId } = req.body;

    const deleteCartProduct = await cartModel.deleteOne({ productId: productId });
    if (deleteCartProduct) {
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}



export async function adminfetchusers(req, res) {
  try {
    const users = await userModel.find();
    res.json({ users });

  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }

  // console.log(users);
};

export async function admindeleteuser(req, res) {
  const userId = req.params.userId;
  console.log(userId);

  try {

    const userDelete = await userModel.deleteOne({ _id: userId });
    const productsDelete = await productsModel.deleteMany({ userId: userId });
    const cartDelete = await cartModel.deleteMany({ userId: userId });

    if (userDelete.n > 0 || (productsDelete.n > 0 && cartDelete.n > 0)) {
      res.status(200).json({ message: 'User and related records deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user and related records:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}







export async function buynow(req, res) {
  try {
    const { userId } = req.body;
    console.log(userId);


    const items = await cartModel.find({ userId: userId });

    for (const item of items) {
      console.log("cart-count", item.count);
      const product = await productsModel.findOne({ _id: item.productId });
      console.log("product-count", product.stock);

      const cartcount =item.count;
      const productcount = product.stock;
        if (productcount === cartcount) {
          await productsModel.deleteOne({ _id: item.productId  });
          await cartModel.deleteMany({ productId: item.productId });
          console.log("Product deleted - cart-count and product-count are equal");
        }


      if (product.stock < item.count) {
        return res.status(400).json({ message: 'Not enough stock to fulfill the order' });
      }
      product.stock -= item.count;
      await product.save();
      console.log("updated - cart-id", item.productId );
      console.log("updated - product-id", product._id);

      console.log("updated - cart-count", item.count);
      console.log("updated - product-count", product.stock);

    
    }

    await cartModel.deleteMany({ userId: userId });
    return res.status(200).json({ message: 'Buy process completed successfully' });
  


  } catch (error) {
    console.error('Error handling buy now:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

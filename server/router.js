import { Router } from "express";

import * as user from "./request-handlers/user.handler.js";
import * as product from "./request-handlers/products.handler.js";
import { Auth} from "./middlewares/auth.js";
import uploader from "./middlewares/multer.js";

const productUploader = uploader([
  { name: "images", maxCount: 6 },
]);

const router = Router();

router.route("/register").post(user.register);
router.route("/login").post(user.login);
router.route("/profile").get(Auth, user.getProfile);


// router.route("/get-category").get(product.getCategory);
router.route("/add-products").post(productUploader,product.addProduct);
router.route("/get-products").get(product.getProducts);
router.route("/view-product/:productId").get(product.viewProducts);
router.route("/add-to-cart").post(Auth,product.addToCart);
router.route("/get-cart").get(Auth,product.getCart);
router.route("/increment-cart").post(product.incrementCart);
router.route("/decrement-cart").post(product.decrementCart);
router.route("/delete-cart-item").delete(Auth,product.deleteCartItem);
router.route("/check-cart/:productId").get(Auth,product.checkCart);
router.route("/delete-product/:productId").delete(product.deleteproduct);
router.route("/uploaded-images/:productId").get(product.getimg);
router.route("/delete-cart-item").post(product.removeCart);
router.route("/buy-now").post(product.buynow);


router.route("/get-users").get(product.adminfetchusers);
router.route("/delete-user/:userId").delete(product.admindeleteuser);
// /api

export default router;

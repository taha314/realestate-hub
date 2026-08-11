import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { addWishList, getWishList, removeWishList } from '../controllers/wishlist.controller.js';

const wishlistRouter = express.Router();

wishlistRouter.post("/:propertyId", protect, addWishList);
wishlistRouter.get("/", protect, getWishList);
wishlistRouter.delete("/:propertyId", protect, removeWishList);

export default wishlistRouter;

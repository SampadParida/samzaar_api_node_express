import express from 'express';
import * as cartController from '../controllers/cart.js';
const router = express.Router();

router.post('/add', cartController.addToCart)
router.get('/details', cartController.getCartDetails)

export default router;
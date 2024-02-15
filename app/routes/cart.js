import express from 'express';
import * as cartController from '../controllers/cart.js';
import { mandatoryTokenValidation } from '../helpers/validation.js';
const router = express.Router();

router.post('/add', mandatoryTokenValidation, cartController.addToCart)
router.get('/details', mandatoryTokenValidation, cartController.getCartDetails)

export default router;
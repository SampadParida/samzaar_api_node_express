import express from 'express';
import * as productController from '../controllers/product.js';
const router = express.Router();

router.get('/list', productController.getProducts)
router.post('/add', productController.addProduct)
router.get('/:id', productController.getProductDetails)

export default router;
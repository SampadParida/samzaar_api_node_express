import express from 'express';
import * as authController from '../controllers/auth.js';
const router = express.Router();

router.post('/signup', authController.signUp)
router.post('/login', authController.logIn)

export default router;
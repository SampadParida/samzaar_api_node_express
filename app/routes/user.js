import express from 'express';
import * as userController from '../controllers/user.js';
const router = express.Router();

router.get('/list', userController.getUsers)
router.get('/:id', userController.getSingleUser)

export default router;
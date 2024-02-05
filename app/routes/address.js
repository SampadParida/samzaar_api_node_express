import express from 'express';
import * as addressController from '../controllers/address.js';
const router = express.Router();

router.get('/list', addressController.getAddresses)
router.post('/create', addressController.addAddress)
router.put('/update/:address_id', addressController.updateAddresses)
router.delete('/delete/:address_id', addressController.deleteAddresses)

export default router;
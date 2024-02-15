import express from 'express';
import * as addressController from '../controllers/address.js';
import { mandatoryTokenValidation } from '../helpers/validation.js';
const router = express.Router();

router.get('/list', mandatoryTokenValidation, addressController.getAddresses)
router.get('/selected', mandatoryTokenValidation, addressController.getSelectedAddress)
router.post('/create', mandatoryTokenValidation, addressController.addAddress)
router.put('/select/:address_id', mandatoryTokenValidation, addressController.updateAddresses)
router.delete('/delete/:address_id', mandatoryTokenValidation, addressController.deleteAddresses)

export default router;
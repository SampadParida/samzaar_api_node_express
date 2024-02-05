
import { mongoose } from "mongoose";

const addressSchema = new mongoose.Schema({
    state: String,
    city: String,
    address: String,
    landmark: String,
    phone: String,
    pincode: String,
    isSelected: Boolean
});

const Address = mongoose.model('Address', addressSchema);

export default Address;


import { mongoose } from "mongoose";

const addressSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users' // Reference to the User collection
    },
    state: String,
    city: String,
    address: String,
    landmark: String,
    phone: String,
    pincode: String,
    isSelected: Boolean,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Address = mongoose.model('Address', addressSchema);

export default Address;

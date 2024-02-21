import { mongoose } from "mongoose";
import Product from "./product.js";
import User from "./user.js";


const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    products: [{
        product_id:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
    }],
    status: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
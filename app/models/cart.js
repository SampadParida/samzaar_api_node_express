import { mongoose } from "mongoose";


const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    products: [{
        product_id:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'products'
        },
        quantity: Number,
        amount: Number,
    }],
    status: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
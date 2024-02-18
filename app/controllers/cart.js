import { mongoose } from "mongoose";
import Cart from '../models/cart.js'

const getCartDetails = async (req, res) => {
    try {
        // CHECK IF USER HAS EXISTING CART DOCUMENT WITH STATUS NOT COMPLETED
        let cart = await Cart.findOne({ user_id: req.user_id, status: 'CREATED' }).populate('products.product_id').exec();
        return res.status('200').json({ "cart": cart });
    } catch (e) {
        return res.status('500').json({ "error": e });
    }
};

const updateCart = async (req, res) => {
    try {
        let resp = res;
        // CHECK IF USER HAS EXISTING CART DOCUMENT WITH STATUS NOT COMPLETED
        let cart = await Cart.findOne({ user_id: req.user_id, status: 'CREATED' });
        // IF CART DOCUMENT EXISTS WITH STATUS CREATED
        if (cart) {
            // CHECK IF PRODUCT EXISTS IN CART
            const existingProduct = cart.products.find(product => product.product_id == req.body.product_id);
            if (!existingProduct && req?.body?.action == 'add') {
                cart = await Cart.updateOne(
                    { user_id: req.user_id, status: 'CREATED' },
                    {
                        $push: {
                            products: {
                                product_id: req.body.product_id,
                                quantity: req.body.quantity,
                                amount: req.body.amount
                            }
                        },
                    }
                )
            } else {
                // UPDATE THE EXISTING PRODUCT QUANTITY AND AMOUNT
                if (existingProduct.quantity > 0) {
                    let finalQuantity = existingProduct.quantity + Number(req?.body.quantity);
                    let finalAmount = existingProduct.amount + Number(req?.body.amount);
                    if (req?.body?.action === 'remove') {
                        finalAmount = existingProduct.amount - Number(req?.body.amount);
                        finalQuantity = existingProduct.quantity - Number(req?.body.quantity)
                    }
                    cart = await Cart.updateOne(
                        { user_id: req.user_id, status: 'CREATED', 'products.product_id': req.body.product_id },
                        {
                            $set: {
                                'products.$.quantity': finalQuantity,
                                'products.$.amount': finalAmount,
                            }
                        }
                    )
                } else {
                    if(existingProduct){
                        cart = await Cart.updateOne(
                            { user_id: req.user_id, status: 'CREATED' },
                            {
                                $pull: {
                                    products: {
                                        product_id: req.body.product_id
                                    }
                                },
                            }
                        )
                    }             
                }
            }
            resp.status('200')
        } else {
            // IF NOT EXISTS THEN CREATE A NEW CART DOCUMENT
            const newCart = await new Cart({
                user_id: req.user_id,
                status: 'CREATED',
                products: [
                    {
                        product_id: req.body.product_id,
                        quantity: req.body.quantity,
                        amount: req.body.amount
                    }
                ]
            });
            cart = await newCart.save();
            resp.status('201')
        }

        // FINALLY RETURN THE CART IN RESPONSE
        return resp.json({
            "message": "Cart updated successfully!",
            "cart": cart
        })
    } catch (e) {
        return res.status('500').json({ "error": e });
    }
};

export {
    getCartDetails, updateCart
};
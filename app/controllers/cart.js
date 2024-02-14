import Jwt from 'jsonwebtoken';
import Cart from '../models/cart.js'

const getCartDetails = async (req, res) => {
    // CHECK IF TOKEN PRESENT
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.send(`Token missing`)
    }

    // CHECK IF TOKEN IS VALID
    Jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }, async (err) => {
        if (err) {
            return res.send("Invalid Token")
        }
        try {
            const tokendata = Jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
            let resp = res;
            // CHECK IF USER HAS EXISTING CART DOCUMENT WITH STATUS NOT COMPLETED
            let cart = await Cart.findOne({ user_id: tokendata.user_id, status: 'CREATED' });
            return res.status('200').json({"cart":cart});
        } catch(e) {
            return res.status('500').json({"error":e});
        }
    })

    // IF NOT SET CART TO NULL
    // RETURN CART DETAILS
};

const addToCart = async (req, res) => {
    // CHECK IF TOKEN PRESENT
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.send(`Token missing`)
    }

    // CHECK IF TOKEN IS VALID
    Jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }, async (err) => {
        if (err) {
            return res.send("Invalid Token")
        }
        try {
            const tokendata = Jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
            let resp = res;
            // CHECK IF USER HAS EXISTING CART DOCUMENT WITH STATUS NOT COMPLETED
            let cart = await Cart.findOne({ user_id: tokendata.user_id, status: 'CREATED' });
            // IF CART DOCUMENT EXISTS WITH STATUS CREATED
            if (cart) {
                // CHECK IF PRODUCT EXISTS IN CART
                const existingProduct = cart.products.find(product => product.product_id == req.body.product_id);
                if (!existingProduct) {
                    cart = await Cart.updateOne(
                        { user_id: tokendata.user_id, status: 'CREATED' },
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
                    cart = await Cart.updateOne(
                        { user_id: tokendata.user_id, status: 'CREATED', 'products.product_id': req.body.product_id },
                        {
                            $set: {
                                'products.$.quantity': existingProduct.quantity + Number(req.body.quantity),
                                'products.$.amount': existingProduct.amount + Number(req.body.amount),
                            }
                        }
                    )
                }
                resp.status('200')
            } else {
                // IF NOT EXISTS THEN CREATE A NEW CART DOCUMENT
                const newCart = await new Cart({
                    user_id: tokendata.user_id,
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
                "message" : "Cart updated successfully!",
                "cart" : cart
            })
        } catch (e) {
            return res.status('500').json({"error":e});
        }
    })

};

export {
    getCartDetails, addToCart
};
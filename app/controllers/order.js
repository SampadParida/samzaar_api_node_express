import Razorpay from "razorpay";

const createOrder = async function (req, res) {
    var instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY, key_secret: process.env.RAZORPAY_SECRET })

    const order = await instance.orders.create({
        amount: 50000,
        currency: "INR",
        receipt: "receipt#1",
        notes: {
            key1: "value3",
            key2: "value2"
        }
    })

    if(!order){
        return res.status('500').send('Error');
    }

    return res.send(order);
}

export {
    createOrder
}
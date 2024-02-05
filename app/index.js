import dotenv from 'dotenv';
import express from 'express';
import { mongoose } from "mongoose";
import cors from 'cors';
import userRouter from './routes/user.js'
import authRouter from './routes/auth.js'
import productRouter from './routes/product.js'
import orderRouter from './routes/order.js'
import addressRouter from './routes/address.js'

dotenv.config();
export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(
    process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

app.get('/', (req, res) => {
    res.send('OK');
});

app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/product', productRouter);
app.use('/order', orderRouter);
app.use('/address', addressRouter);
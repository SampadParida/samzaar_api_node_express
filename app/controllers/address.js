import Address from '../models/address.js'
import Jwt from 'jsonwebtoken';

const getSelectedAddress = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(400).json({ message: 'Unauthorized: Token is missing' });
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token is missing' });
    }
    Jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }, async (err) => {
        if (err) {
            console.log('err = ', err)
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        try {
            const tokendata = Jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
            const foundAddress = await Address.findOne({ user_id: tokendata.user_id, isSelected: true }, { __v: 0, created_at:0, updated_at:0, user_id:0 });
            return res.json(foundAddress)
        } catch (e) {
            return res.status(500).send(err);
        }
    });
}

const getAddresses = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(400).json({ message: 'Unauthorized: Token is missing' });
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token is missing' });
    }
    Jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }, async (err) => {
        if (err) {
            console.log('err = ', err)
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        try {
            const tokendata = Jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
            const foundAddresses = await Address.find({ user_id: tokendata.user_id }, { __v: 0 }).sort({created_at:-1});
            return res.json(foundAddresses)
        } catch (e) {
            return res.status(500).send(err);
        }
    });
};

const deleteAddresses = async (req, res) => {
    try {
        const toBeDeleted = await Address.find({ _id: req.params.address_id });
        console.log('toBeDeleted => ', toBeDeleted)
        if (toBeDeleted) {
            await toBeDeleted.destroy();
            return res.json({ message: 'Address deleted successfully!' });
        } else {
            return res.status(404).json({ message: 'Address could not found' });
        }
    } catch (err) {
        console.log('err => ', err)
        return res.status(500).json({ message: 'something went wrong!' });
    }
};

const updateAddresses = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token is missing' });
    }

    try {
        const toBeUpdated = await Address.find({ _id: req.params.address_id });
        if (toBeUpdated) {
            const decodedToken = Jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
            await Address.updateMany({ user_id: decodedToken.user_id }, { $set: { isSelected: false } });
            await Address.updateOne(
                { _id: req.params.address_id },
                { $set: { isSelected: req.body.isSelected } }
            );
            return res.status(200).json({ message: 'Address updated successfully!' });
        } else {
            return res.status(404).json({ message: 'Address could not found' });
        }
    } catch (err) {
        console.log('err => ', err)
        return res.status(500).json({ message: 'something went wrong!' });
    }
}

const addAddress = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token is missing' });
    }

    try {
        const decodedToken = Jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        
        if(!req.body.city){
            return res.status(400).json({ message: 'Missing city' });
        }
        if(!req.body.state){
            return res.status(400).json({ message: 'Missing state' });
        }
        if(!req.body.pincode){
            return res.status(400).json({ message: 'Missing pincode' });
        }
        if(!req.body.address){
            return res.status(400).json({ message: 'Missing address' });
        }
        if(!req.body.landmark){
            return res.status(400).json({ message: 'Missing landmark' });
        }

        const newAddress = new Address({
            user_id: decodedToken.user_id,
            state: req.body.state,
            city: req.body.city,
            address: req.body.address,
            landmark: req.body.landmark,
            phone: req.body.phone,
            pincode: req.body.pincode,
            isSelected: true
        });
        await Address.updateMany({ user_id: decodedToken.user_id }, { $set: { isSelected: false } });
        const savedAddress = await newAddress.save();
        res.status(201).json(savedAddress);
    } catch (e) {
        res.status(500).send(`Could not create entry: ${err}`);
    }
};

export {
    getAddresses, addAddress, deleteAddresses, updateAddresses, getSelectedAddress
};
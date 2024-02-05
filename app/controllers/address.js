import Address from '../models/address.js'
import Jwt from 'jsonwebtoken';

const getAddresses = async (req, res) => {
    await Address.find({})
        .then(found => {
            return res.send(found);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
};

const deleteAddresses = async (req, res) => {
    try {
        const toBeDeleted = await Address.find({ _id: req.params.address_id });
        console.log('toBeDeleted => ', toBeDeleted)
        if (toBeDeleted) {
            await toBeDeleted.destroy();
            console.log('===================== done')
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
    try {
        const toBeUpdated = await Address.find({ _id: req.params.address_id });
        if (toBeUpdated) {
            await Address.updateOne(
                { _id: req.params.address_id },
                { $set: { isSelected: req.body.isSelected } }
            );
            return res.json({ message: 'Address updated successfully!' });
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
    console.log('token = ', token)
    console.log('process.env.JWT_SECRET ==== ', process.env.JWT_SECRET)
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token is missing' });
    }

    Jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }, (err) => {
        console.log('err = ', err)
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        next();
    });

    if (!req.body.city) {
        return res.status(400).json({ message: 'City missing' });
    }
    if (!req.body.state) {
        return res.status(400).json({ message: 'State missing' })
    }
    if (!req.body.pincode) {
        return res.status(400).json({ message: 'Pincode missing' })
    }
    if (!req.body.phone) {
        return res.status(400).json({ message: 'Phone number missing' })
    }
    if (!req.body.address) {
        return res.status(400).json({ message: 'Address missing' })
    }
    if (!req.body.landmark) {
        return res.status(400).json({ message: 'Landmark missing' })
    }
    if (!req.body.isSelected) {
        return res.status(400).json({ message: 'isSelected missing' })
    }
    const newAddress = new Address({
        state: req.body.state,
        city: req.body.city,
        address: req.body.address,
        landmark: req.body.landmark,
        phone: req.body.phone,
        pincode: req.body.pincode,
        isSelected: req.body.isSelected
    })
    console.log('newAddress = ', newAddress)
    await newAddress
        .save()
        .then(
            (entry) => { return res.send(entry) },
            (err) => {
                res.status(500);
                return res.send(`'Could not create and entry! = ${err}`)
            }
        )
};

export {
    getAddresses, addAddress, deleteAddresses, updateAddresses
};
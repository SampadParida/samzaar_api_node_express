import Address from '../models/address.js'



const getSelectedAddress = async (req, res) => {
    try {
        const foundAddress = await Address.findOne({ user_id: req.user_id, isSelected: true }, { __v: 0, created_at:0, updated_at:0, user_id:0 });
        return res.json(foundAddress)
    } catch (e) {
        return res.status(500).send(err);
    }
}

const getAddresses = async (req, res) => {
    try {
        const foundAddresses = await Address.find({ user_id: req.user_id }, { __v: 0 }).sort({created_at:-1});
        return res.json(foundAddresses)
    } catch (e) {
        return res.status(500).send(err);
    }
};

const deleteAddresses = async (req, res) => {
    try {
        const toBeDeleted = await Address.find({ _id: req.params.address_id });
        if (toBeDeleted) {
            await toBeDeleted.destroy();
            return res.json({ message: 'Address deleted successfully!' });
        } else {
            return res.status(404).json({ message: 'Address could not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'something went wrong!' });
    }
};

const updateAddresses = async (req, res) => {

    try {
        const toBeUpdated = await Address.find({ _id: req.params.address_id });
        if (toBeUpdated) {
            await Address.updateMany({ user_id: req.user_id }, { $set: { isSelected: false } });
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
    try {        
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
            user_id: req.user_id,
            state: req.body.state,
            city: req.body.city,
            address: req.body.address,
            landmark: req.body.landmark,
            phone: req.body.phone,
            pincode: req.body.pincode,
            isSelected: true
        });
        await Address.updateMany({ user_id: req.user_id }, { $set: { isSelected: false } });
        const savedAddress = await newAddress.save();
        res.status(201).json(savedAddress);
    } catch (e) {
        res.status(500).send(`Could not create entry: ${err}`);
    }
};

export {
    getAddresses, addAddress, deleteAddresses, updateAddresses, getSelectedAddress
};
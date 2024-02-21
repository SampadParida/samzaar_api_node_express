import User from '../models/user.js'
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

function makeJwtToken(payload) {
    const t = Jwt.sign(
        payload, process.env.JWT_SECRET, { expiresIn: "30d" }
    );
    return t
}

const signUp = async (req, res) => {
    try{
        const foundUser = await User.findOne({ email: req.body.email });
        if(foundUser){
            return res.status(400).send(`Email id ${req.body.email} is taken.`)
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                is_verified: false
            });
            await newUser.save();
            let token = makeJwtToken({
                email: newUser.email, name: newUser.name, user_id: newUser._id
            })
            return res.send({ message: "Successfully Registered!", token: token })
        }
    } catch(err){
        return res.status(400).json({'message' : `Could not create an entry! = ${err}`})
    }
};

const logIn = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400);
        return res.send('Email or Password is missing.')
    }
    const foundUser = await User.findOne({ email: req.body.email });
    if (!foundUser) {
        return res.status(404).json({ "Message": `Email id ${req.body.email} is not registered yet.` })
    } else {
        // COMPARE THE PASSWORD
        bcrypt.compare(req.body.password, foundUser.password, async (err, result) => {
            if (result == true) {
                let token = makeJwtToken({
                    email: foundUser.email, name: foundUser.name, user_id: foundUser._id
                })
                return res.send({ message: "Successfully Logged in!", token: token })
                // return res.send('Logged in')
            } else {
                return res.status(400).send('Password not correct!')
            }
        })
    }
}

export {
    signUp, logIn,
};
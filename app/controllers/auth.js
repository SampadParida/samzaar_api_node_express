import User from '../models/user.js'
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

function makeJwtToken (payload) {
    console.log('payload = ', payload)
    console.log('process.env.JWT_SECRET = ', process.env.JWT_SECRET)
    const t = Jwt.sign(
        payload, process.env.JWT_SECRET, { expiresIn: "30d" }
    );
    return t
}

const signUp = async (req, res) => {
    await User.findOne({ email: req.body.email })
        .then(async userObj => {
            if (!userObj) {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    is_verified: false
                })
                await newUser
                    .save()
                    .then(
                        (entry) => { return res.send(entry) },
                        (err) => {
                            res.status(500);
                            return res.send(`'Could not create and entry! = ${err}`)
                        }
                    )
            } else {
                return res.status(400).send(`Email id ${req.body.email} is taken.`)
            }
        })
};

const logIn = async (req, res) => {
    console.log('I am in login controller !')
    if(!req.body.email || !req.body.password){
        res.status(400);
        return res.send('Email or Password is missing.')
    }
    await User.findOne({ email: req.body.email })
        .then(async userObj => {
            if (!userObj) {
                res.status(404);
                return res.send(`Email id ${req.body.email} is not registered yet.`)
            }

            // COMPARE THE PASSWORD
            const isPasswordCorrect = bcrypt.compare(req.body.password, userObj.password, async (err, result) => {
                if(result == true){
                    let token = makeJwtToken({
                        email: userObj.email, name: userObj.name, user_id: userObj._id
                    })
                    return res.send({message: "Successfully Logged in!", token: token})
                    // return res.send('Logged in')
                } else{
                    return res.status(400).send('Password not correct!')
                }
            })
        })
}

export {
    signUp, logIn,
};
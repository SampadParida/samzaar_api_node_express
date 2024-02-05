import User from '../models/user.js'


const getUsers = async (req, res) => {
    await User.find({})
        .then(found => {
            return res.send(found);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
};

const getSingleUser = async (req, res) => {
    await User.findOne({ _id: req.params.id })
        .then(
            (userObj) => {
                if (!userObj) {
                    res.status(400);
                    return res.send('User not found!')
                }

                return res.send(userObj)
            }
        )
        .catch(err => {
            res.status(400);
            return res.send('Bad Request')
        })
}

export {
    getUsers, getSingleUser,
};
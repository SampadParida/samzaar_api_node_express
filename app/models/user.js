
import { mongoose } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    is_verified: {
        type: Boolean,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});
userSchema.pre('save', async function (next) {
    const user = this;

    // Hash the password only if it has been modified or is new
    if (!user.isModified('password')) return next();

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});
const User = mongoose.model('user', userSchema);

export default User;

import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        required: [true, 'Please provide Email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email'
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minLength: 6
    },
    lastName: {
        type: String,
        trim: true,
        maxLength: 20,
        default: 'lastName'
    },
    location: {
        type: String,
        trim: true,
        maxLength: 20,
        default: 'my city'
    }
})

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
}

UserSchema.methods.comparePassword = async function (possiblePassword) {
    const isMatch = await bcrypt.compare(possiblePassword, this.password)
    return isMatch
}

const User = mongoose.model('User', UserSchema)

export default User
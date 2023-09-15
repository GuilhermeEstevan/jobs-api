import User from "../models/User.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError } from "../errors/index.js"


export const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    const token = user.createJWT()

    res.status(StatusCodes.CREATED).json({
        user: {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
            token
        }
    })
}

export const login = async (req, res) => {
    const { email, password } = req.body

    // check for email and password
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    // check in DB
    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    // compare password
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({
        user: {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
            token
        }
    })
}

export const updateUser = async (req, res) => {
    const { name, lastName, email, location } = req.body
    
    if (!name || !lastName || !email || !location) {
        throw new BadRequestError('Please provide all values')
    }
    const user = await User.findOne({ _id: req.user.userId })

    user.name = name
    user.lastName = lastName
    user.email = email
    user.location = location

    await user.save()
    const token = user.createJWT()

    res.status(StatusCodes.OK).json({
        user: {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
            token
        }
    })
    // console.log(req.user);
    // console.log(req.body);
}
import express from 'express'
const router = express.Router()
import authenticateUser from '../middleware/authentication.js'
import rateLimiter from 'express-rate-limit'
import { login, register, updateUser } from '../controllers/auth.js'

const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: {
        msg: "Too many request from this IP, please try again after 15 minutes"
    }
})

router.post('/register', apiLimiter, register)
router.post('/login', apiLimiter, login)
router.patch('/updateUser', authenticateUser, updateUser)

export default router
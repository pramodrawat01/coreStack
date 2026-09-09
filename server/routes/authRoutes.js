import express from 'express'
import { acceptInvite, login, logout, me, signup } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const authRouter = express.Router()

authRouter.post('/signup', signup )
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.post('/accept-invite', acceptInvite)
authRouter.get('/me', protect, me)

export default authRouter
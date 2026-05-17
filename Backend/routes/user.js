import express from "express"
import { CurrentUser } from "../controllers/User.js"
import { Auth } from "../middleware/Auth.js"

const UserRouter=express.Router()

UserRouter.get('/me',Auth,CurrentUser)


export default UserRouter
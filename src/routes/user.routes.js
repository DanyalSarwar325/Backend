import { Router } from "express"
import { registerUser,LOGIN,logoutUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { veriftJWT } from "../middlewares/auth.middleware.js"

const app = Router()

app.route("/register").post(
  upload.fields([
    { name: "avatar", 
        maxCount: 1 },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
)

app.route("/login").post(LOGIN)
app.route('/logout').post(veriftJWT,logoutUser)

export default app //on next page ,we can only give it our own name if it is exported default

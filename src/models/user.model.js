import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String, //cloudinary url
    },
    watchHistory: {
      type: Schema.Types.ObjectId,
      ref: "video",
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
)
userSchema.pre("save", async function (next) {
  if (!this.isModeified("password")) return next()
  this.password = bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.IsPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
  jwt.sign(
    {
      _id: this._id,
      fullName: this.fullName,
      email: this.email,
      avatar: this.avatar,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  )
}
userSchema.methods.generateAccessToken = function () {
    jwt.sign(
        {
          _id: this._id,
       
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
      )
}

export const User = mongoose.model("User", userSchema)

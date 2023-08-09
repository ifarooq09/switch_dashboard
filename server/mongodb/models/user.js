import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true},
    role: { type: String, required: true},
    avatar: {type: String},
})


const userModel = mongoose.model('User', UserSchema)

export default userModel
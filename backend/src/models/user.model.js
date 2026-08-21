const mongoose = require("mongoose")


const userSchema =  new mongoose.Schema({
    username:{
        type: String,
        required: [true,"username is requierd"],
        unique: [true,"username is unique"]
    },
    email:{
        type: String,
        required: [true,"email is required"],
        unique:[true,"email is unique"]
    },
    password:{
        type: String,
        required: [true,"password is required"],
        select: false
    }
})

const userModel = mongoose.model("users",userSchema)

module.exports = userModel
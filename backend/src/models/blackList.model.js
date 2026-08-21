const mongoose = require("mongoose")

const blackListSchema = new mongoose.Schema({
    token:{
        type: String,
        required: [true, "token is required for blacklisting"]
    }
},{timestamps: true})

const blackListModel = mongoose.model("blacklistToken",blackListSchema)

module.exports = blackListModel
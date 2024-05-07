const { Schema } = require("mongoose");

const ReplySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true, 
        ref: "User",
    },
    reply:{
        type: String,
        required: true,
    },
    createdAt:{
        type:Date,
        default: Date.now,
    }
})

module.exports = ReplySchema;

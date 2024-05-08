const { Schema } = require("mongoose");

const replySchema = new Schema({
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
    },
})

module.exports = replySchema;

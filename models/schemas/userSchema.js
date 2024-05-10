const { Schema } = require("mongoose");

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            index: true,
            match: /^[a-zA-Z가-힣0-9]+$/,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            // select: false,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        profilePictureUrl: {
            type: String,
            required: true,
        },
        comments: {
            type: String,
            required: true,
        },
    },
    { versionKey: false }
);

module.exports = userSchema;
module.exports = userSchema;

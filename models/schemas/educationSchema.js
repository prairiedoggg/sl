const { Schema } = require("mongoose");

const educationSchema = new Schema({
    schoolName: {
        type: String,
    },
    degree: {
        type: String,
    },
    fieldOfStudy: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
});

module.exports = educationSchema;

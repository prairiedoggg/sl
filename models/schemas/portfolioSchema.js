const { Schema } = require("mongoose");

const portfolioSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    link: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
});

module.exports = portfolioSchema;

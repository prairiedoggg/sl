const { Schema } = require("mongoose");

const PortfolioSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    link: {
        type: String,
    },
});

module.exports = PortfolioSchema;

const { Schema } = require("mongoose");

const certificateSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    name: {
        type: String,
    },
    issuingOrganization: {
        type: String,
    },
    issueDate: {
        type: Date,
    },
});

module.exports = certificateSchema;

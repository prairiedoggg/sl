const { Schema } = require("mongoose");

const awardSchema = new Schema({
    awardName: {
        type: String,
    },
    issuingOrganization: {
        type: String,
    },
    issueDate: {
        type: Date,
    },

    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
});

module.exports = awardSchema;

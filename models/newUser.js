const { Schema, default: mongoose } = require("mongoose");

const UserSchema = new Schema({
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

    education: [
        {
            type: Schema.Types.ObjectId,
            ref: "Education",
        },
    ],
    award: [
        {
            type: Schema.Types.ObjectId,
            ref: "Award",
        },
    ],
    certificate: [
        {
            type: Schema.Types.ObjectId,
            ref: "Certificate",
        },
    ],
    portfolioUrl: [
        {
            data: Buffer,
            contentType: String,
        },
    ],
});

const AwardSchema = new Schema({
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

const CertificateSchema = new Schema({
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

const EducationSchema = new Schema({
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

const PortfolioSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    link: {
        type: String,
    },
});

module.exports = {
    User: mongoose.model("User", UserSchema),
    Education: mongoose.model("Education", EducationSchema),
    Certificate: mongoose.model("Certificate", CertificateSchema),
    Award: mongoose.model("Award", AwardSchema),
    Portfolio: mongoose.model("Portfolio", PortfolioSchema),
};

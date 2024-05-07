const mongoose = require("mongoose");
const UserSchema = require("./schemas/userSchema");
const EducationSchema = require("./schemas/educationSchema");
const AwardSchema = require("./schemas/awardSchema");
const PortfolioSchema = require("./schemas/portfolioSchema");
const CertificateSchema = require("./schemas/CertificateSchema");
const ReplySchema = require("./schemas/replySchema");
const { Schema, model } = require("mongoose");
const User = mongoose.model("User", UserSchema);
const Education = mongoose.model("Education", EducationSchema);
const Certificate = mongoose.model("Certificate", CertificateSchema);
const Award = mongoose.model("Award", AwardSchema);
const Portfolio = mongoose.model("Portfolio", PortfolioSchema);
const Reply = mongoose.model("Reply", ReplySchema);

module.exports = {
    User,
    Education,
    Certificate,
    Award,
    Portfolio,
    Reply
};

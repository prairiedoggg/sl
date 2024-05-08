const mongoose = require("mongoose");
const userSchema = require("./schemas/userSchema");
const educationSchema = require("./schemas/educationSchema");
const awardSchema = require("./schemas/awardSchema");
const portfolioSchema = require("./schemas/portfolioSchema");
const certificateSchema = require("./schemas/certificatesSchema");
const replySchema = require("./schemas/replySchema");
const User = mongoose.model("User", userSchema);
const Education = mongoose.model("Education", educationSchema);
const Certificate = mongoose.model("Certificate", certificateSchema);
const Award = mongoose.model("Award", awardSchema);
const Portfolio = mongoose.model("Portfolio", portfolioSchema);
const Reply = mongoose.model("Reply", replySchema);

module.exports = {
    User,
    Education,
    Certificate,
    Award,
    Portfolio,
    Reply
};

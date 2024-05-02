const { Schema, default: mongoose } = require("mongoose");

const User2Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profilePictureUrl: {
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
  portfolioUrl: {
    type: Schema.Types.ObjectId,
    ref: "Portfolio",
  },
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
  type: String,
});

module.exports = {
  User2: mongoose.model("User2", User2Schema),
  Education: mongoose.model("Education", EducationSchema),
  Certificate: mongoose.model("Certificate", CertificateSchema),
  Award: mongoose.model("Award", AwardSchema),
  Portfolio: mongoose.model("Portfolio", PortfolioSchema),
};

// const mongoose = require('mongoose');
// const {Schema} = require('mongoose');

// const UserSchema = new Schema({
//     username: {
//         type: String,
//         required: true,
//         unique: true,
//         index: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     education: [{  
//         schoolName: {
//             type: String,
//             required: false
//         },
//         degree: {
//             type: String,
//             required: false
//         },
//         fieldOfStudy: {
//             type: String,
//             required: false
//         },
//         startDate: {
//             type: Date,
//             required: false
//         },
//         endDate: {
//             type: Date,
//             required: false
//         },
//     }],

//     certificates: [{
//         name: {
//             type: String,
//             required: false
//         },
//         issuingOrganization: {
//             type: String,
//             required: false 
//         },
//         issueDate: {
//             type: Date,
//             required: false
//         },  
//     }],
//     awards: [{
//         name: {
//             type: String,
//             required: false 
//         },
//         issuingOrganization: {
//             type: String,
//             required: false
//         },
//         issueDate: {
//             type: Date,
//             required: false
//         },
//     }],
//     portfolioUrl: {
//         type: String,
//         required: false,
//     },

// });

// module.exports = mongoose.model('User', UserSchema);

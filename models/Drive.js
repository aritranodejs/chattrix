const mongoose = require('mongoose');

// Define the schema with timestamps option
const driveSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    },
    tableType: {
        type: String,
        comment: 'Type of table example: users',
    },
    fileType: {
        type: String,
        comment: 'example : users_image, users_document',
    },
    filePath: {
        type: String
    },
    fileFor: {
        type: String,
        enum: ['own', 'send'],
        default: 'own'
    }
}, {
  timestamps: true, // This will automatically add createdAt and updatedAt fields
});

// Create the model
const Drive = mongoose.model('Drive', driveSchema);

module.exports = {
    Drive
};

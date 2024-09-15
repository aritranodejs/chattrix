const mongoose = require('mongoose');

// Define the schema with timestamps option
const friendSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    },
    status: {
        type: String,
        enum: ['initiate', 'accepted', 'rejected', 'blocked', 'unfriend'],
        default: 'initiate'
    },
    acceptedAt: {
        type: Date
    },
    rejectedAt: {
        type: Date
    },
    blockedAt: {
        type: Date
    },
    unfriendAt: {
        type: Date
    }
}, {
  timestamps: true, // This will automatically add createdAt and updatedAt fields
});

// Create the model
const Friend = mongoose.model('Friend', friendSchema);

module.exports = {
    Friend
};

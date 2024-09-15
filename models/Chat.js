const mongoose = require('mongoose');

// Define the schema with timestamps option
const chatSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    },
    message: {
        type: String
    }
}, {
  timestamps: true, // This will automatically add createdAt and updatedAt fields
});

// Create the model
const Chat = mongoose.model('Chat', chatSchema);

module.exports = {
    Chat
};

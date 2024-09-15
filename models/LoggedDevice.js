const mongoose = require('mongoose');

// Define the schema with timestamps option
const loggedDeviceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    },
    deviceId: {
        type: String
    },
    deviceType: {
        type: String
    },
    ipAddress: {
        type: String
    },
    isLoggedIn: {
        type: Boolean
    },
    lastLogin: {
        type: Date
    },
    lastLogout: {
        type: Date
    }
}, {
  timestamps: true, // This will automatically add createdAt and updatedAt fields
});

// Create the model
const LoggedDevice = mongoose.model('LoggedDevice', loggedDeviceSchema);

module.exports = {
    LoggedDevice
};

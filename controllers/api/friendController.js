// Validator
const { Validator } = require('node-input-validator');

// Helpers
const { response } = require("../../config/response");

// Model
const { User } = require('../../models/User');
const { Friend } = require('../../models/Friend');
const { Drive } = require('../../models/Drive');

const index = async (req, res) => { 
    try {
        const { 
            _id 
        } = req.user;

        // Fetch friends where the user is either the sender or receiver
        const friends = await Friend.find({
            $or: [
                { senderId: _id },
                { receiverId: _id }
            ],
            status: { $in: ['accepted', 'blocked'] } // Status can be 'accepted' or 'blocked'
        }).populate('receiverId') // Populate receiverId and get all the fields 
        .populate('senderId') // Populate senderId to get details if needed
        .lean();

        // Extract IDs of friends for further querying
        const friendIds = friends.map(friend => 
            friend.senderId._id.toString() !== _id.toString() 
            ? friend.senderId._id 
            : friend.receiverId._id
        );

        // Fetch drives related to these friends where the user is either the sender or receiver
        const drives = await Drive.find({
            $or: [
                { senderId: _id, receiverId: { $in: friendIds } },
                { receiverId: _id, senderId: { $in: friendIds } }
            ],
            tableType: 'users',
            fileType: 'users_image'
        }).populate('receiverId') // Populate receiverId with all details
        .populate('senderId') // Populate senderId to get details if needed
        .lean();

        return response(res, { friends, drives }, 'Friends', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const searchFriends = async (req, res) => {
    try {
        const { _id } = req.user;
        let { search } = req.query;

        // Search for users based on the search query
        const friends = await User.find({
            $or: [
                { name: { $regex: search, $options: 'i' } }, // Case-insensitive search for name
                { uniqueId: { $regex: search, $options: 'i' } } // Case-insensitive search for uniqueId
            ],
            _id: { $ne: _id }, // Exclude the current user
            status: 'active', // Only search active users
            role: 'user' // Search only users with the role 'user'
        }).lean();

        const friendIds = friends.map(friend => friend._id);

        // Get the current user's friend list
        const userFriends = await Friend.find({
            $or: [
                { senderId: _id, status: 'accepted' }, // Friends where the current user is the sender
                { receiverId: _id, status: 'accepted' } // Friends where the current user is the receiver
            ]
        }).lean();

        // Create a Set of the current user's friend IDs for fast lookup
        const userFriendIds = new Set(
            userFriends.map(friend => 
                friend.senderId.toString() === _id.toString() ? friend.receiverId.toString() : friend.senderId.toString()
            )
        );

        // Modify the friends array to include isFriend: true/false
        const updatedFriends = friends.map(friend => ({
            ...friend,
            isFriend: userFriendIds.has(friend._id.toString()) // Check if the friend is in the user's friend list
        }));

        // Fetch drives (related images or additional user info)
        const drives = await Drive.find({
            $or: [
                { senderId: { $in: friendIds } },
                { receiverId: { $in: friendIds } }
            ],
            tableType: 'users',
            fileType: 'users_image'
        })
        .populate('receiverId') // Populate receiverId with all details
        .populate('senderId') // Populate senderId if needed
        .lean();

        return response(res, { friends: updatedFriends, drives }, 'Friends', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};


const store = async (req, res) => { 
    try {
        // Validate the input
        const validator = new Validator(req.body, {
            receiverId: 'required'
        });

        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        const {
            _id
        } = req.user;

        const {
            receiverId
        } = req.body;
        const errors = {};

        const friendExists = await Friend.findOne({
            senderId: _id,
            receiverId: receiverId
        })

        if (friendExists) {
            errors['receiverId'] = {
                'rule' : 'unique',
                'message' : 'Already sent a friend request'
            }
        }

        // If there are any errors, return them
        if (Object.keys(errors).length > 0) {
            return response(res, req.body, errors, 422);
        }

        const friend = new Friend();
        friend.senderId = _id;
        friend.receiverId = receiverId;
        friend.status = 'initiate';
        await friend.save();

        return response(res, friend, 'Friend Request Sent Successfully', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const toggleStatus = async (req, res) => { 
    try {
        const { 
            _id 
        } = req.user;
        const { 
            receiverId, 
            status 
        } = req.params;
        
        let updateData = {};
        let message = '';

        if (status === 'accepted') {
            updateData = {
                status: 'accepted',
                acceptedAt: new Date()
            };
            message = 'You both are now friends';
        } else if (status === 'rejected') {
            updateData = {
                status: 'rejected',
                rejectedAt: new Date()
            };
            message = 'Friend request rejected';
        } else if (status === 'blocked') {
            updateData = {
                status: 'blocked',
                blockedAt: new Date()
            };
            message = 'User has been blocked';
        } else if (status === 'unfriend') {
            updateData = {
                status: 'unfriend',
                unfriendAt: new Date()
            };
            message = 'You are no longer friends';
        } else {
            return response(res, {}, 'Invalid status', 422);
        }

        const friend = await Friend.findOneAndUpdate(
            { senderId: _id, receiverId: receiverId },
            updateData,
            { new: true } // Return the updated document
        ).lean();

        if (!friend) {
            return response(res, {}, 'Friend relationship not found', 422);
        }

        return response(res, friend, message, 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

module.exports = {
    searchFriends,
    index,
    store,
    toggleStatus
}


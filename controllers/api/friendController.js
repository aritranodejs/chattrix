// Validator
const { Validator } = require('node-input-validator');

// Helpers
const { response } = require("../../config/response");

// Model
const { User } = require('../../models/User');
const { Friend } = require('../../models/Friend');

const searchFriends = async (req, res) => {
    let { search } = req.query;

    const friends = await User.find({
        $or: [
            {
                name: {
                    $regex: search,
                    $options: 'i' // Case-insensitive search for name
                },
            },
            {
                uniqueId: {
                    $regex: search,
                    $options: 'i' // Case-insensitive search for uniqueId
                }
            }
        ],
        status: 'active', // Only search active users
        role: 'user' // Search only users with the role 'user'
    }).lean();

    return response(res, friends, 'Friends', 200);
};

const index = async (req, res) => { 
    try {
        const {
            _id
        } = req.user;

        const friends = await Friend.find({
            senderId: _id,
            status: { $in: ['accepted', 'blocked'] } // Status can be 'accepted' or 'blocked'
        }).populate('receiverId', 'name') // Populate receiverId and get only the 'name' field
        .lean();

        return response(res, friends, 'Friends', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

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
        friend.save();

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


// Validator
const { Validator } = require('node-input-validator');

// Helpers
const { response } = require("../../config/response");

// Socket Helper
const { emitEventToRoom } = require('../../helpers/socketHelper');

// Model
const { Chat } = require('../../models/Chat');

const chatsWithReceiver = async (req, res) => { 
    try {
        const {
            _id 
        } = req.user;
        const {
            receiverId 
        } = req.params;

        const chats = await Chat.find({
            $or: [
                { senderId: _id, receiverId: receiverId }, // Case where logged-in user is the sender
                { senderId: receiverId, receiverId: _id }  // Case where logged-in user is the receiver
            ]
        }).lean(); // Makes it a plain JS object

        return response(res, chats, 'Chats', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const store = async (req, res) => { // Socket 
    try {
        // Validate the input
        const validator = new Validator(req.body, {
            receiverId: 'required',
            message: 'required'
        });

        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        const {
            _id
        } = req.user;

        const {
            receiverId,
            message
        } = req.body;

        const chat = new Chat();
        chat.senderId = _id;
        chat.receiverId = receiverId;
        chat.message = message;
        chat.save();

        // Send message to the chat room using Socket.IO
        const room = _id < receiverId ? `${_id}-${receiverId}` : `${receiverId}-${_id}`;
        emitEventToRoom(req?.io, room, 'message', chat);

        return response(res, chat, 'Message Sent Successfully', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const edit = async (req, res) => {
    try {
        // Validate the input
        const validator = new Validator(req.body, {
            message: 'required'
        });

        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }
        const {
            id
        } = req.params

        const {
            message
        } = req.body;

        const chat = await Chat.findById(id);
        if (!chat) {
            return response(res, {}, 'Chat not found', 422);
        }

        chat.message = message;
        await chat.save();

        return response(res, chat, 'Message Edited Successfully', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const chat = await Chat.findByIdAndDelete(id); // Directly find and delete the document
        if (!chat) {
            return response(res, {}, 'Chat not found', 422);
        }

        return response(res, chat, 'Message Deleted Successfully', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }   
}

module.exports = {
    chatsWithReceiver,
    store,
    edit,
    destroy
}


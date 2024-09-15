// Validator
const { Validator } = require('node-input-validator');

// Helpers
const { response } = require("../../config/response");

// Model
const { Chat } = require('../../models/Chat');

const chatsWithReceiver = async (req, res) => { // Socket 
    try {
        const {
            _id
        } = req.user;
        const {
            receiverId
        } = req.params;

        const chats = await Chat.find({
            senderId: _id,
            receiverId: receiverId
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

        return response(res, chat, 'Message Sent Successfully', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const edit = async (req, res) => { // Socket 
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

const destroy = async (req, res) => { // Socket 
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


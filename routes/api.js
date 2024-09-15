const express = require("express");
const group = require("express-group-routes");

// Router
var router = express.Router();

// Helpers
const { response } = require("../config/response");

// JWT Middleware - Auth
const { authentication, roleAuthorization } = require('../config/auth');

// Controllers 
const friendController = require('../controllers/api/friendController');
const chatController = require('../controllers/api/chatController');

// Routes
router.get('/', (req, res) => {
    try {
        return response(res, req.body, 'Welcome API', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
});

router.group('/friends', (router) => {
    router.use([authentication, roleAuthorization('user')]);
    router.get('/', friendController.index);
    router.get('/search', friendController.searchFriends)
    router.post('/store', friendController.store);
    router.post('/toggle/:receiverId/:status', friendController.toggleStatus);
});

router.group('/chats', (router) => {
    router.use([authentication, roleAuthorization('user')]);
    router.get('/:receiverId', chatController.chatsWithReceiver);
    router.post('/store', chatController.store);
    router.put('/edit/:id', chatController.edit);
    router.delete('/destroy/:id', chatController.destroy);
});

module.exports = router;
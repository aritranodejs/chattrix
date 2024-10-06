import express from "express";
import group from "express-group-routes"; 

// Router
const router = express.Router();

// Helpers
import { response } from "../config/response.js"; 

// JWT Middleware - Auth
import { authentication, roleAuthorization } from '../config/auth.js'; 

// Controllers 
import * as friendController from '../controllers/api/friendController.js'; 
import * as chatController from '../controllers/api/chatController.js'; 

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
    router.get('/search', friendController.searchFriends);
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

// Default export 
export default router; 
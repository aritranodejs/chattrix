import express from 'express';
import group from 'express-group-routes';

// Helpers
import { response } from '../config/response.js';

// JWT Middleware - Auth
import { authentication, roleAuthorization } from '../config/auth.js';

// Controllers
import { register } from '../controllers/auth/registerController.js';
import { login, logout } from '../controllers/auth/loginController.js';

// Router
const router = express.Router();

// Routes
router.get('/', (req, res) => {
    try {
        return response(res, req.body, 'Welcome Auth API', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
});

router.group('/', (router) => {
    router.post('/register', register);
    router.post('/login', login);
    router.post('/logout', [authentication], logout);
});

// Default export 
export default router;

import express from 'express';
import group from 'express-group-routes';

// Helpers
import { response } from '../config/response.js';

// JWT Middleware - Auth
import { authentication, roleAuthorization } from '../config/auth.js';

// Router
const router = express.Router();

// Routes
router.get('/', (req, res) => {
    try {
        return response(res, req.body, 'Welcome API', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
});

// Default export 
export default router;

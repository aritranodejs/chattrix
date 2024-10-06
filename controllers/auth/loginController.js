// Import Validator (from node-input-validator)
import { Validator } from 'node-input-validator';

// Import Bcrypt for password hashing
import bcrypt from 'bcrypt';

// Import Common Response
import { response } from '../../config/response.js';

// Import JWT Middleware - Auth
import { generateAuthToken } from '../../config/auth.js';

// Import User Agent Parser
import useragent from 'useragent';

// Import Models
import { User } from '../../models/User.js';
import { LoggedDevice } from '../../models/LoggedDevice.js';

const login = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            email: 'required',
            password: 'required'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        let errors = {};
        const {
            email,
            password
        } = req.body;

        const user = await User.findOne({
            email: email.toLowerCase() 
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            errors['email'] = {
                message: 'Invalid credentials.',
                rule: 'same'
            };
        }

        if (Object.keys(errors).length) {
            return response(res, errors, 'validation', 422);
        }

        user.authToken = generateAuthToken({ ...user.toJSON() }); 
        user.isOnline = true;
        await user.save();

        // Add logged device
        const agent = useragent.parse(req.headers['user-agent']);
        let deviceType = agent.device.toString();  // Detect device type
        if (deviceType === 'Other 0.0.0') {
            deviceType = 'Unknown Device';  // Fallback if detection fails
        }
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const normalizedIpAddress = (ipAddress === '::1') ? '127.0.0.1' : ipAddress;

        let loggedDevice = await LoggedDevice.findOne({
            userId : user._id.toString(),
            ipAddress: normalizedIpAddress
        })
        
        if (!loggedDevice) {
            loggedDevice = new LoggedDevice();
            loggedDevice.userId = user.id;
            loggedDevice.deviceType = deviceType;
            loggedDevice.ipAddress = normalizedIpAddress;
            loggedDevice.isLoggedIn = true;
            loggedDevice.lastLogin = new Date();
        } else {
            loggedDevice.deviceType = deviceType;
            loggedDevice.isLoggedIn = true;
            loggedDevice.lastLogin = new Date();
        }
        await loggedDevice.save();

        return response(res, { user, loggedDevice }, 'User login successfull.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const logout = async (req, res) => {
    try {
        const { 
            _id 
        } = req.user;
        
        const user = await User.findOne({
            _id: _id 
        });
        if (!user) {
            return response(res, req.body, 'User not found.', 422);
        }

        // Add the token to the blacklist
        blacklistedTokens.add(user.authToken);

        user.authToken = null;
        user.isOnline = false;
        user.lastSeenAt = new Date();
        await user.save();

        return response(res, user, 'User logout successfull.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

// Export as a named export
export { 
    login,
    logout
};
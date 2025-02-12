// Import jwt
import jwt from 'jsonwebtoken';

const accessTokenSecret = process.env.JWT_SECRET || "jwtsecret";

// Common Response
import { response } from './response.js';

// Generate Auth Token
const generateAuthToken = ({ _id, role, name, email, mobile }) => {
  return jwt.sign({ _id, role, name, email, mobile }, accessTokenSecret);
};

// Authentication Middleware
const authentication = (req, res, next) => {
  const header = req?.headers?.authorization;
  if (!header) {
    return response(res, req.body, "Missing authorization token.", 401);
  }
  const token = header.includes(" ") ? header.split(" ")[1] : header;
  
  // Check if the token is blacklisted
  if (blacklistedTokens.has(token)) {
    return response(res, req.body, "Expired authorization token.", 401);
  }

  jwt.verify(token, accessTokenSecret, (error, user) => {
    try {
      if (error) {
        if (error.name === "TokenExpiredError") {
          return response(res, req.body, "Expired authorization token.", 401);
        } else if (error.name === "JsonWebTokenError") {
          return response(res, req.body, "Invalid authorization token.", 403);
        } else {
          return response(res, req.body, "Unauthorized.", 403);
        }
      }

      req.user = user;
      next();
    } catch (error) {
      return response(res, req.body, error.message, 500);
    }
  });
};

// Role Authorization Middleware
const roleAuthorization = (roleString) => (req, res, next) => {
  const { role } = req.user;

  if (role !== roleString) {
    return response(res, req.body, "Access forbidden.", 403);
  }

  next();
};

// Named exports 
export { 
  generateAuthToken, 
  authentication, 
  roleAuthorization 
};

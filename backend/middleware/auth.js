import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = '7d';

// Sign JWT token
export const signToken = (userId, email) => {
  console.log('🔑 Signing token for user:', email);
  const token = jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
  console.log('✅ Token signed successfully');
  return token;
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    console.log('🔍 Verifying JWT token...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token verified successfully, user:', decoded.email);
    return decoded;
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    throw new Error('Invalid or expired token');
  }
};

// Middleware to require authentication
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('🔐 Authentication check - Authorization header present:', !!authHeader);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ Missing or invalid authorization header');
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7);
  console.log('🔑 Extracted token (first 20 chars):', token.substring(0, 20) + '...');

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    req.email = decoded.email;
    console.log('✨ Authentication successful for user ID:', req.userId);
    next();
  } catch (err) {
    console.error('❌ Authentication error:', err.message);
    return res.status(401).json({ error: err.message });
  }
};

// Middleware for auto-refresh on 401
export const refreshTokenMiddleware = (err, req, res, next) => {
  if (err.message === 'Invalid or expired token' || res.statusCode === 401) {
    // Token expired, client should use refresh token if available
    return res.status(401).json({ error: 'Token expired', shouldRefresh: true });
  }
  next(err);
};

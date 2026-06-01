import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../db/pool.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register - Create admin account
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('📝 Registration attempt for email:', email);

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if user exists
    console.log('🔍 Checking if user already exists...');
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log('❌ Email already registered:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    console.log('🔒 Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    console.log('✅ Password hashed successfully');

    // Create user
    console.log('💾 Inserting user into database...');
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, passwordHash]
    );

    const user = result.rows[0];
    console.log('✨ User created with ID:', user.id);
    
    console.log('🎯 Generating token...');
    const token = signToken(user.id, user.email);
    console.log('✅ Registration successful for:', user.email);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error('❌ Register error:', err.message);
    console.error('🔍 Full error stack:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login - Login with email/password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt for email:', email);

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    console.log('📝 Querying database for user with email:', email);
    const userResult = await pool.query(
      'SELECT id, email, password_hash FROM users WHERE email = $1',
      [email]
    );
    console.log('📊 Database query result:', userResult.rows.length, 'user(s) found');

    if (userResult.rows.length === 0) {
      console.log('❌ User not found in database for email:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];
    console.log('✅ User found:', user.id, user.email);

    // Compare password
    console.log('🔒 Comparing password hashes...');
    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log('🔐 Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password mismatch for user:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('🎯 Password verified, generating token...');
    const token = signToken(user.id, user.email);
    console.log('✨ Token generated successfully');

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    console.error('🔍 Full error stack:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me - Verify token
router.get('/me', requireAuth, async (req, res) => {
  try {
    console.log('🔑 Verifying token for user ID:', req.userId);
    const userResult = await pool.query(
      'SELECT id, email FROM users WHERE id = $1',
      [req.userId]
    );

    if (userResult.rows.length === 0) {
      console.log('❌ User not found with ID:', req.userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ Token verified, user:', userResult.rows[0].email);
    res.json({ user: userResult.rows[0] });
  } catch (err) {
    console.error('❌ Me error:', err.message);
    console.error('🔍 Full error stack:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
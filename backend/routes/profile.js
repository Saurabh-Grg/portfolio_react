import express from "express";
import pool from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Function to create router with upload middleware
export default function createProfileRouter(upload) {

// GET /api/profile — public
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM profile LIMIT 1");
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PUT /api/profile — admin only
router.put("/", requireAuth, async (req, res) => {
  try {
    const {
      name, title, bio, email, phone, location,
      avatar_url, github_url, linkedin_url, twitter_url, website_url,
    } = req.body;

    console.log('📝 Updating profile...');
    const result = await pool.query(
      `UPDATE profile SET
        name = COALESCE($1, name),
        title = COALESCE($2, title),
        bio = COALESCE($3, bio),
        email = COALESCE($4, email),
        phone = COALESCE($5, phone),
        location = COALESCE($6, location),
        avatar_url = COALESCE($7, avatar_url),
        github_url = COALESCE($8, github_url),
        linkedin_url = COALESCE($9, linkedin_url),
        twitter_url = COALESCE($10, twitter_url),
        website_url = COALESCE($11, website_url),
        updated_at = NOW()
      WHERE id = (SELECT id FROM profile LIMIT 1)
      RETURNING *`,
      [name, title, bio, email, phone, location,
       avatar_url, github_url, linkedin_url, twitter_url, website_url]
    );

    console.log('✅ Profile updated successfully');
    res.json({
      message: 'Profile updated successfully',
      profile: result.rows[0]
    });
  } catch (err) {
    console.error('❌ Profile update error:', err.message);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /api/profile/avatar — admin only, upload avatar image
router.post("/avatar", requireAuth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('📸 [Profile] Avatar uploaded:', req.file.filename);
    
    // Return the file URL
    const avatarUrl = `/uploads/${req.file.filename}`;
    
    // Update profile with new avatar URL
    const result = await pool.query(
      `UPDATE profile SET
        avatar_url = $1,
        updated_at = NOW()
      WHERE id = (SELECT id FROM profile LIMIT 1)
      RETURNING *`,
      [avatarUrl]
    );

    console.log('✅ [Profile] Avatar updated in database');
    res.json({
      message: 'Avatar uploaded successfully',
      avatarUrl: avatarUrl,
      profile: result.rows[0]
    });
  } catch (err) {
    console.error('❌ [Profile] Avatar upload error:', err.message);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

// DELETE /api/profile/avatar — admin only, delete avatar
router.delete("/avatar", requireAuth, async (req, res) => {
  try {
    console.log('🗑️ [Profile] Deleting avatar');
    
    // Update profile to remove avatar URL
    const result = await pool.query(
      `UPDATE profile SET
        avatar_url = NULL,
        updated_at = NOW()
      WHERE id = (SELECT id FROM profile LIMIT 1)
      RETURNING *`,
      []
    );

    console.log('✅ [Profile] Avatar deleted');
    res.json({
      message: 'Avatar deleted successfully',
      profile: result.rows[0]
    });
  } catch (err) {
    console.error('❌ [Profile] Avatar delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete avatar' });
  }
});

  return router;
}

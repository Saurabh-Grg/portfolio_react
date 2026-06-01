
import express from "express";
import pool from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
 
const router = express.Router();
 
// POST /api/messages — public (contact form submission)
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
 
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }
 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
 
    const result = await pool.query(
      `INSERT INTO messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, subject || "", message]
    );

    res.status(201).json({
      message: "Message sent successfully",
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});
 
// GET /api/messages — admin only
router.get("/", requireAuth, async (req, res) => {
  try {
    const { unread } = req.query;
    let query = "SELECT * FROM messages";
    const params = [];
 
    if (unread === "true") {
      query += " WHERE is_read = FALSE";
    }
 
    query += " ORDER BY created_at DESC";
 
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});
 
// PATCH /api/messages/:id/read — admin only (mark as read)
router.patch("/:id/read", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE messages SET is_read = TRUE WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Message not found" });
    res.json({
      message: "Message marked as read",
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark message as read" });
  }
});
 
// DELETE /api/messages/:id — admin only
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM messages WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Message not found" });
    res.json({ message: "Message deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});
 
export default router;
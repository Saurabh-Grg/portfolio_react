import express from "express";
import pool from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
 
const router = express.Router();
 
// GET /api/testimonials — public
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM testimonials ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});
 
// POST /api/testimonials — admin only
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, role, company, content, avatar_url, rating } = req.body;

    if (!name || !content) {
      return res.status(400).json({ error: "Name and content are required" });
    }

    const result = await pool.query(
      `INSERT INTO testimonials (name, role, company, content, avatar_url, rating)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, role || "", company || "", content, avatar_url || "", rating ?? 5]
    );

    res.status(201).json({
      message: "Testimonial created successfully",
      testimonial: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create testimonial" });
  }
});
 
// PUT /api/testimonials/:id — admin only
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { name, role, company, content, avatar_url, rating } = req.body;

    const result = await pool.query(
      `UPDATE testimonials SET
        name = COALESCE($1, name),
        role = COALESCE($2, role),
        company = COALESCE($3, company),
        content = COALESCE($4, content),
        avatar_url = COALESCE($5, avatar_url),
        rating = COALESCE($6, rating),
        updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [name, role, company, content, avatar_url, rating, req.params.id]
    );

    if (!result.rows[0]) return res.status(404).json({ error: "Testimonial not found" });
    res.json({
      message: "Testimonial updated successfully",
      testimonial: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update testimonial" });
  }
});
 
// DELETE /api/testimonials/:id — admin only
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM testimonials WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Testimonial not found" });
    res.json({ message: "Testimonial deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
});
 
export default router;
import express from "express";
import pool from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
 
const router = express.Router();
 
// GET /api/projects — public
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM projects ORDER BY featured DESC, created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});
 
// GET /api/projects/:id — public
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects WHERE id = $1", [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: "Project not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch project" });
  }
});
 
// POST /api/projects — admin only
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, description, image_url, tags, demo_url, github_url, featured } = req.body;

    if (!title) return res.status(400).json({ error: "Title is required" });

    const result = await pool.query(
      `INSERT INTO projects (title, description, image_url, tags, demo_url, github_url, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description || "", image_url || "", tags || [], demo_url || "", github_url || "", featured || false]
    );

    res.status(201).json({
      message: "Project created successfully",
      project: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create project" });
  }
});
 
// PUT /api/projects/:id — admin only
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { title, description, image_url, tags, demo_url, github_url, featured } = req.body;

    const result = await pool.query(
      `UPDATE projects SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        image_url = COALESCE($3, image_url),
        tags = COALESCE($4, tags),
        demo_url = COALESCE($5, demo_url),
        github_url = COALESCE($6, github_url),
        featured = COALESCE($7, featured),
        updated_at = NOW()
       WHERE id = $8 RETURNING *`,
      [title, description, image_url, tags, demo_url, github_url, featured, req.params.id]
    );

    if (!result.rows[0]) return res.status(404).json({ error: "Project not found" });
    res.json({
      message: "Project updated successfully",
      project: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update project" });
  }
});
 
// DELETE /api/projects/:id — admin only
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM projects WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});
 
export default router;
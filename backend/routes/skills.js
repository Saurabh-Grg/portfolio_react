import express from "express";
import pool from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
 
const router = express.Router();
 
// GET /api/skills — public
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM skills ORDER BY category, percentage DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});
 
// POST /api/skills — admin only
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, category, percentage } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required" });

    const result = await pool.query(
      `INSERT INTO skills (name, category, percentage)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, category || "General", percentage ?? 0]
    );

    res.status(201).json({
      message: "Skill created successfully",
      skill: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create skill" });
  }
});
 
// PUT /api/skills/:id — admin only
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { name, category, percentage } = req.body;

    const result = await pool.query(
      `UPDATE skills SET
        name = COALESCE($1, name),
        category = COALESCE($2, category),
        percentage = COALESCE($3, percentage),
        updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [name, category, percentage, req.params.id]
    );

    if (!result.rows[0]) return res.status(404).json({ error: "Skill not found" });
    res.json({
      message: "Skill updated successfully",
      skill: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update skill" });
  }
});
 
// DELETE /api/skills/:id — admin only
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM skills WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Skill not found" });
    res.json({ message: "Skill deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete skill" });
  }
});
 
export default router;
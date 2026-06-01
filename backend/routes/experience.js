import express from "express";
import pool from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/experience — public
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM experience ORDER BY current DESC, start_date DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch experience" });
  }
});

// POST /api/experience — admin only
router.post("/", requireAuth, async (req, res) => {
  try {
    const { company, position, duration, description, type, start_date, end_date, current } = req.body;

    if (!company || !position) {
      return res.status(400).json({ error: "Company and position are required" });
    }

    const result = await pool.query(
      `INSERT INTO experience (company, position, duration, description, type, start_date, end_date, current)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [company, position, duration || "", description || "", type || "work",
       start_date || null, end_date || null, current || false]
    );

    res.status(201).json({
      message: "Experience created successfully",
      experience: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create experience" });
  }
});

// PUT /api/experience/:id — admin only
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { company, position, duration, description, type, start_date, end_date, current } = req.body;

    const result = await pool.query(
      `UPDATE experience SET
        company = COALESCE($1, company),
        position = COALESCE($2, position),
        duration = COALESCE($3, duration),
        description = COALESCE($4, description),
        type = COALESCE($5, type),
        start_date = COALESCE($6, start_date),
        end_date = COALESCE($7, end_date),
        current = COALESCE($8, current),
        updated_at = NOW()
       WHERE id = $9 RETURNING *`,
      [company, position, duration, description, type, start_date, end_date, current, req.params.id]
    );

    if (!result.rows[0]) return res.status(404).json({ error: "Experience not found" });
    res.json({
      message: "Experience updated successfully",
      experience: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update experience" });
  }
});

// DELETE /api/experience/:id — admin only
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM experience WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Experience not found" });
    res.json({ message: "Experience deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete experience" });
  }
});

export default router;
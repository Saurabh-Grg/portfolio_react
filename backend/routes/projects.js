// import express from "express";
// import pool from "../db/pool.js";
// import { requireAuth } from "../middleware/auth.js";
 
// const router = express.Router();
 
// // GET /api/projects — public
// router.get("/", async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT * FROM projects ORDER BY featured DESC, created_at DESC"
//     );
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch projects" });
//   }
// });
 
// // GET /api/projects/:id — public
// router.get("/:id", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM projects WHERE id = $1", [req.params.id]);
//     if (!result.rows[0]) return res.status(404).json({ error: "Project not found" });
//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch project" });
//   }
// });
 
// // POST /api/projects — admin only
// router.post("/", requireAuth, async (req, res) => {
//   try {
//     const { title, description, image_url, tags, demo_url, github_url, featured } = req.body;

//     if (!title) return res.status(400).json({ error: "Title is required" });

//     const result = await pool.query(
//       `INSERT INTO projects (title, description, image_url, tags, demo_url, github_url, featured)
//        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
//       [title, description || "", image_url || "", tags || [], demo_url || "", github_url || "", featured || false]
//     );

//     res.status(201).json({
//       message: "Project created successfully",
//       project: result.rows[0]
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to create project" });
//   }
// });
 
// // PUT /api/projects/:id — admin only
// router.put("/:id", requireAuth, async (req, res) => {
//   try {
//     const { title, description, image_url, tags, demo_url, github_url, featured } = req.body;

//     const result = await pool.query(
//       `UPDATE projects SET
//         title = COALESCE($1, title),
//         description = COALESCE($2, description),
//         image_url = COALESCE($3, image_url),
//         tags = COALESCE($4, tags),
//         demo_url = COALESCE($5, demo_url),
//         github_url = COALESCE($6, github_url),
//         featured = COALESCE($7, featured),
//         updated_at = NOW()
//        WHERE id = $8 RETURNING *`,
//       [title, description, image_url, tags, demo_url, github_url, featured, req.params.id]
//     );

//     if (!result.rows[0]) return res.status(404).json({ error: "Project not found" });
//     res.json({
//       message: "Project updated successfully",
//       project: result.rows[0]
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update project" });
//   }
// });
 
// // DELETE /api/projects/:id — admin only
// router.delete("/:id", requireAuth, async (req, res) => {
//   try {
//     const result = await pool.query(
//       "DELETE FROM projects WHERE id = $1 RETURNING id",
//       [req.params.id]
//     );
//     if (!result.rows[0]) return res.status(404).json({ error: "Project not found" });
//     res.json({ message: "Project deleted", id: req.params.id });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete project" });
//   }
// });
 
// export default router;


import express from "express";
import pool from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Helper: delete a file from disk safely
const deleteFile = (fileUrl) => {
  if (!fileUrl || fileUrl.startsWith("http")) return;
  try {
    const filePath = path.join(__dirname, "../public", fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("🗑️ Deleted file:", filePath);
    }
  } catch (err) {
    console.warn("⚠️ Could not delete file:", err.message);
  }
};

// ─── Public Routes ────────────────────────────────────────────────────────────

// GET /api/projects
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM projects ORDER BY featured DESC, created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// GET /api/projects/:id
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects WHERE id = $1", [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: "Project not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// ─── Admin Routes ─────────────────────────────────────────────────────────────

// POST /api/projects — create project (no images yet; upload images after creation)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, description, image_url, tags, demo_url, github_url, featured } = req.body;

    if (!title) return res.status(400).json({ error: "Title is required" });

    const result = await pool.query(
      `INSERT INTO projects (title, description, image_url, images, tags, demo_url, github_url, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        title,
        description || "",
        image_url || "",
        [],                          // images start empty
        tags || [],
        demo_url || "",
        github_url || "",
        featured || false,
      ]
    );

    res.status(201).json({
      message: "Project created successfully",
      project: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// PUT /api/projects/:id — update project metadata
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { title, description, image_url, tags, demo_url, github_url, featured } = req.body;

    const result = await pool.query(
      `UPDATE projects SET
        title       = COALESCE($1, title),
        description = COALESCE($2, description),
        image_url   = COALESCE($3, image_url),
        tags        = COALESCE($4, tags),
        demo_url    = COALESCE($5, demo_url),
        github_url  = COALESCE($6, github_url),
        featured    = COALESCE($7, featured),
        updated_at  = NOW()
       WHERE id = $8 RETURNING *`,
      [title, description, image_url, tags, demo_url, github_url, featured, req.params.id]
    );

    if (!result.rows[0]) return res.status(404).json({ error: "Project not found" });

    res.json({
      message: "Project updated successfully",
      project: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// DELETE /api/projects/:id — delete project and all its images from disk
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    // Fetch project first so we can clean up files
    const existing = await pool.query("SELECT * FROM projects WHERE id = $1", [req.params.id]);
    if (!existing.rows[0]) return res.status(404).json({ error: "Project not found" });

    const project = existing.rows[0];

    // Delete all uploaded images from disk
    if (project.image_url) deleteFile(project.image_url);
    if (project.images?.length) {
      project.images.forEach(deleteFile);
    }

    await pool.query("DELETE FROM projects WHERE id = $1", [req.params.id]);

    res.json({ message: "Project deleted", id: req.params.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// ─── Image Upload Routes ───────────────────────────────────────────────────────

// POST /api/projects/:id/images — upload multiple screenshots (admin only)
// Uses multer upload passed in from server.js via createProjectsRouter(upload)
// We export a factory function so server.js can inject the multer instance.
export function createProjectsRouter(upload) {
  // POST /api/projects/:id/images
  router.post("/:id/images", requireAuth, upload.array("images", 10), async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      console.log(`📸 [Projects] Uploading ${req.files.length} images for project ${req.params.id}`);

      // Build URL paths for each uploaded file
      const newImageUrls = req.files.map((f) => `/uploads/${f.filename}`);

      // Append new URLs to the existing images array in DB
      const result = await pool.query(
        `UPDATE projects
         SET images     = array_cat(images, $1::text[]),
             image_url  = CASE WHEN image_url = '' THEN $2 ELSE image_url END,
             updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [newImageUrls, newImageUrls[0], req.params.id]
      );

      if (!result.rows[0]) {
        // Delete uploaded files if project not found
        req.files.forEach((f) => deleteFile(`/uploads/${f.filename}`));
        return res.status(404).json({ error: "Project not found" });
      }

      console.log("✅ [Projects] Images saved to DB");
      res.json({
        message: `${req.files.length} image(s) uploaded successfully`,
        imageUrls: newImageUrls,
        project: result.rows[0],
      });
    } catch (err) {
      console.error("❌ [Projects] Image upload error:", err);
      // Clean up uploaded files on error
      if (req.files) req.files.forEach((f) => deleteFile(`/uploads/${f.filename}`));
      res.status(500).json({ error: "Failed to upload images" });
    }
  });

  // DELETE /api/projects/:id/images — remove one image URL from the array (admin only)
  router.delete("/:id/images", requireAuth, async (req, res) => {
    try {
      const { imageUrl } = req.body;

      if (!imageUrl) return res.status(400).json({ error: "imageUrl is required" });

      console.log(`🗑️ [Projects] Removing image ${imageUrl} from project ${req.params.id}`);

      // Remove the URL from the images array
      const result = await pool.query(
        `UPDATE projects
         SET images     = array_remove(images, $1::text),
             image_url  = CASE WHEN image_url = $1 THEN COALESCE((
               SELECT unnest(array_remove(images, $1::text)) LIMIT 1
             ), '') ELSE image_url END,
             updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [imageUrl, req.params.id]
      );

      if (!result.rows[0]) return res.status(404).json({ error: "Project not found" });

      // Delete from disk
      deleteFile(imageUrl);

      res.json({
        message: "Image removed successfully",
        project: result.rows[0],
      });
    } catch (err) {
      console.error("❌ [Projects] Image delete error:", err);
      res.status(500).json({ error: "Failed to remove image" });
    }
  });

  // PATCH /api/projects/:id/images/primary — set a specific image as the primary thumbnail
  router.patch("/:id/images/primary", requireAuth, async (req, res) => {
    try {
      const { imageUrl } = req.body;

      if (!imageUrl) return res.status(400).json({ error: "imageUrl is required" });

      const result = await pool.query(
        `UPDATE projects SET image_url = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
        [imageUrl, req.params.id]
      );

      if (!result.rows[0]) return res.status(404).json({ error: "Project not found" });

      res.json({
        message: "Primary image updated",
        project: result.rows[0],
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update primary image" });
    }
  });

  return router;
}

export default router;
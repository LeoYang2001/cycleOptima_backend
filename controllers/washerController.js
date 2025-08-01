const db = require("../db/db");
const { getEmbedding } = require("../util/embeddingTool");
require("dotenv").config();

exports.getAllWasherCycles = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM washer_cycles");
    res.json(results);
  } catch (err) {
    console.error("Error fetching washer cycles:", err);
    res.status(500).json({ error: "Database error" });
  }
};

exports.createWasherCycle = async (req, res) => {
  const { id, displayName, engineer_note, data } = req.body;

  const text = `${displayName ?? ""} ${engineer_note ?? ""}`;
  console.log("embedding text:", text);
  try {
    const embedding = await getEmbedding(text);
    const sql =
      "INSERT INTO washer_cycles (id, displayName, data, embedding, engineer_note) VALUES (?, ?, ?, ?, ?)";
    await db.query(sql, [
      id,
      displayName,
      JSON.stringify(data),
      JSON.stringify(embedding),
      engineer_note,
    ]);
    req.app.get("io").emit("cycle_updated");
    res.status(201).json({ message: "Cycle created", id });
  } catch (err) {
    console.error("Error inserting cycle:", err);
    res.status(500).json({ error: err.message || "Insert failed" });
  }
};

exports.deleteWasherCycleById = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM washer_cycles WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `No cycle found with id: ${id}` });
    }

    req.app.get("io").emit("cycle_updated");
    res.json({ message: "Cycle deleted", id });
  } catch (err) {
    console.error("Error deleting cycle:", err);
    res.status(500).json({ error: err.message || "Delete failed" });
  }
};

exports.upsertWasherCycle = async (req, res) => {
  const { id, displayName, engineer_note, data } = req.body;

  // Validate required fields
  if (!displayName) {
    return res.status(400).json({ error: "displayName is required" });
  }

  try {
    const text = `${displayName ?? ""} ${engineer_note ?? ""}`;
    const embedding = await getEmbedding(text);

    let cycleId = id;
    let isUpdate = false;

    // If no ID provided, create a new one
    if (!cycleId) {
      // Generate new ID: displayName + timestamp
      const timestamp = new Date().getTime();
      cycleId = `${displayName.replace(/\s+/g, "_")}_${timestamp}`;
    } else {
      // Check if cycle with this ID exists for update
      const [existingCycle] = await db.query(
        "SELECT id FROM washer_cycles WHERE id = ?",
        [cycleId]
      );
      isUpdate = existingCycle.length > 0;
    }

    if (isUpdate) {
      // Update existing cycle
      const updateSql = `
        UPDATE washer_cycles 
        SET displayName = ?, data = ?, embedding = ?, engineer_note = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      const [result] = await db.query(updateSql, [
        displayName,
        JSON.stringify(data),
        JSON.stringify(embedding),
        engineer_note,
        cycleId,
      ]);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: `No cycle found with id: ${cycleId}` });
      }

      req.app.get("io").emit("cycle_updated");
      res.json({
        message: "Cycle updated successfully",
        id: cycleId,
        operation: "update",
      });
    } else {
      // Create new cycle
      const insertSql = `
        INSERT INTO washer_cycles (id, displayName, data, embedding, engineer_note) 
        VALUES (?, ?, ?, ?, ?)
      `;
      await db.query(insertSql, [
        cycleId,
        displayName,
        JSON.stringify(data),
        JSON.stringify(embedding),
        engineer_note,
      ]);

      req.app.get("io").emit("cycle_updated");
      res.status(201).json({
        message: "Cycle created successfully",
        id: cycleId,
        operation: "create",
      });
    }
  } catch (err) {
    console.error("Error upserting cycle:", err);
    res.status(500).json({ error: err.message || "Operation failed" });
  }
};




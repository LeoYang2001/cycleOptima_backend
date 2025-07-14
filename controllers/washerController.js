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

  console.log(JSON.stringify(engineer_note, null, 2));
  console.log("data:", JSON.stringify(data, null, 2));
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

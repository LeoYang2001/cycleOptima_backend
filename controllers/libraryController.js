const db = require("../db/db");

exports.getComponentLibrary = async (req, res) => {
  console.log("Fetching component library");
  try {
    const [rows, fields] = await db.query(
      "SELECT * FROM component_library ORDER BY label ASC"
    );
    console.log(rows);
    res.json(rows); // ✅ This is your actual data
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getComponentsByType = async (req, res) => {
  const { compId } = req.params;
  try {
    const [rows, fields] = await db.query(
      "SELECT * FROM component_library WHERE comp_id = $1",
      [compId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addComponentTemplate = async (req, res) => {
  const { id, label, comp_id, duration, motor_config } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO component_library (id, label, comp_id, duration, motor_config)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, label, comp_id, duration, motor_config]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

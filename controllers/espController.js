// controllers/espController.js
const db = require("../db/db");

exports.runFlash = async (req, res) => {
  const { cycleId } = req.body;
  try {
    const [results] = await db.query(
      "SELECT * FROM washer_cycles WHERE id = ?",
      [cycleId]
    );
    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: `No cycle found with id: ${cycleId}` });
    }

    const flashResult = await flashCycleToESP(results[0]);
    res.json({
      message: `hello, ${cycleId}`,
      cycle: results[0],
      flashResult,
    });
  } catch (err) {
    console.error("Error fetching washer cycle by id:", err);
    res.status(500).json({ error: "Database error" });
  }
};

async function flashCycleToESP(cycle) {
  const payload = { app: cycle.data }; // wrap cycle data in 'app'
  try {
    console.log("Flashing cycle to ESP:", payload);
    const response = await fetch(
      "https://278b8f56fca2.ngrok-free.app/api/flash",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload, null, 2),
      }
    );
    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    console.error("Error flashing to ESP:", err.message);
    return { success: false, error: err.message };
  }
}

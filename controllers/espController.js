const db = require("../db/db");

// Update cycle status to 'tested' and set tested_at, then emit 'cycle_updated'
async function updateCycleTested(cycleId, req) {
  console.log(
    `Updating cycle ${cycleId} status to 'tested' at ${new Date().toISOString()}`
  );
  try {
    const testedAt = new Date();
    const sql = `
      UPDATE washer_cycles
      SET status = ?, tested_at = ?
      WHERE id = ?
    `;
    await db.query(sql, ["tested", testedAt, cycleId]);
    if (req && req.app && req.app.get && req.app.get("io")) {
      req.app.get("io").emit("cycle_updated");
    }
    return { success: true };
  } catch (err) {
    console.error("Error updating cycle tested status:", err);
    return { success: false, error: err.message };
  }
}
// controllers/espController.js

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

    const overwriteResult = await overwriteSpiff(results[0]);
    let flashResult = null;
    if (overwriteResult.success) {
      flashResult = await flashCycleToESP();
    }

    updateCycleTested(cycleId, req).then((updateResult) => {
      if (!updateResult.success) {
        return res.status(500).json({ error: "Failed to update cycle status" });
      }
      res.json({
        message: `hello, ${cycleId}`,
        cycle: results[0],
        overwriteResult,
        flashResult,
      });
    });
  } catch (err) {
    console.error("Error fetching washer cycle by id:", err);
    res.status(500).json({ error: "Database error" });
  }
};

const localAgentUrl = "https://0c2c45c81a02.ngrok-free.app";

async function overwriteSpiff(cycle) {
  // Send the new JSON directly (no need to wrap in { app: ... } unless your API expects it)
  try {
    console.log("Overwriting Spiff with cycle data:", cycle.data);
    if (!cycle || !cycle.data) {
      throw new Error("Invalid cycle data provided");
    }
    const response = await fetch(`${localAgentUrl}/api/input`, {
      method: "PUT", // Use PUT, not POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cycle.data, null, 2), // Send the new JSON content
    });
    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    console.error("Error overwriting Spiff:", err.message);
    return { success: false, error: err.message };
  }
}

async function flashCycleToESP() {
  try {
    console.log("Flashing cycle to ESP (no params)");
    const response = await fetch(`${localAgentUrl}/api/flash`, {
      method: "POST",
    });
    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    console.error("Error flashing to ESP:", err.message);
    return { success: false, error: err.message };
  }
}

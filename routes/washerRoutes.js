const express = require("express");
const router = express.Router();
const washerController = require("../controllers/washerController");

// GET all washer cycles
router.get("/", washerController.getAllWasherCycles);

// POST new washer cycle
router.post("/", washerController.createWasherCycle);
router.delete("/delete/:id", washerController.deleteWasherCycleById);
router.post("/upsert", washerController.upsertWasherCycle);

module.exports = router;

const express = require("express");
const router = express.Router();
const libraryController = require("../controllers/libraryController");

router.get("/", libraryController.getComponentLibrary);
router.get("/:compId", libraryController.getComponentsByType);
router.post("/", libraryController.addComponentTemplate);

module.exports = router;

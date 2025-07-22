const express = require("express");
const router = express.Router();

// Get OpenAI API Key for frontend
router.get("/openai-key", async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        message: "OpenAI API key not found in environment variables",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        openai_api_key: apiKey,
      },
    });
  } catch (error) {
    console.error("Error fetching OpenAI API key:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch OpenAI API key",
      error: error.message,
    });
  }
});

// Get all environment configuration (excluding sensitive database info)
router.get("/", async (req, res) => {
  try {
    const config = {
      openai_api_key: process.env.OPENAI_API_KEY,
      port: process.env.PORT || 4000,
      // Add other non-sensitive config as needed
    };

    res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error("Error fetching configuration:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch configuration",
      error: error.message,
    });
  }
});

module.exports = router;

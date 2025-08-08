const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const washerRoutes = require("./routes/washerRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const configRoutes = require("./routes/configRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Make io accessible in routes/controllers
app.set("io", io);

// Health check endpoint for Docker
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

const espController = require("./controllers/espController");
app.post("/api/esp/run-flash", espController.runFlash);

app.use("/api/washer-cycles", washerRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/config", configRoutes);

//AI VOICE AGENT FEATURE
app.post("/api/session", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2025-06-03",
        }),
      }
    );

    const data = await response.json();

    if (!data.client_secret?.value) {
      throw new Error("No client_secret returned");
    }

    res.json({ clientSecret: data.client_secret.value });
  } catch (err) {
    console.error("Failed to create session:", err.message);
    res.status(500).json({ error: "Failed to generate client secret" });
  }
});

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "0.0.0.0";

server.listen(PORT, HOST, () => {
  console.log(`✅ Server is running on http://${HOST}:${PORT}`);
  console.log(`🌐 Server accessible from network at http://[YOUR_IP]:${PORT}`);
  console.log(`📡 API endpoints available at:`);
  console.log(`   - GET  http://[YOUR_IP]:${PORT}/api/library`);
  console.log(
    `   - GET  http://[YOUR_IP]:${PORT}/api/library/component/:compId`
  );
  console.log(`   - POST http://[YOUR_IP]:${PORT}/api/library`);
  console.log(`   - GET  http://[YOUR_IP]:${PORT}/api/config/openai-key`);
  console.log(`   - GET  http://[YOUR_IP]:${PORT}/api/config`);
});

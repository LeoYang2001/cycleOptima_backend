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

app.use("/api/washer-cycles", washerRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/config", configRoutes);

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

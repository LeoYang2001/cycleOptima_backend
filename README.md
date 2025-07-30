# CycleOptima Backend

This is the backend server for CycleOptima, deployed on Railway.

## 🚀 Railway Deployment

Your project is live at:
**https://cycleoptima-production.up.railway.app/**

### How to Deploy/Update

1. Install the Railway CLI:
   ```sh
   npm i -g railway
   ```
2. Log in to Railway:
   ```sh
   railway login
   ```
3. Initialize the project (if not already):
   ```sh
   railway init
   ```
4. Deploy:
   ```sh
   railway up
   ```

---

## 📡 API Endpoints

### Health Check

- **GET** `/health`
  - Returns server status and uptime.

### Washer Cycles

- **GET** `/api/washer-cycles`
- **POST** `/api/washer-cycles`

### Library

- **GET** `/api/library`
- **GET** `/api/library/component/:compId`
- **POST** `/api/library`

### Config

- **GET** `/api/config/openai-key`
- **GET** `/api/config`

### ESP: Run & Flash Cycle

- **POST** `/api/esp/run-flash`
  - **Body:** `{ "cycleId": "your_cycle_id" }`
  - **Description:** Logs the cycleId and returns a confirmation message.

---

## 📝 Notes

- This backend is designed to be deployed on Railway and is not intended to access local files or hardware directly.
- For ESP hardware integration, use a separate local agent as described in the project documentation.

---

For any issues, please contact the project maintainer.

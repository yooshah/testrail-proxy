const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const TESTRAIL_URL = process.env.TESTRAIL_URL;
const AUTH = {
  username: process.env.TESTRAIL_USER,
  password: process.env.TESTRAIL_API_KEY,
};

app.get("/testrail/*", async (req, res) => {
  try {
    const proxyPath = req.originalUrl.replace("/testrail", "/index.php?");
    console.log("➡️ Forwarding to:", `${TESTRAIL_URL}${proxyPath}`);
    const response = await axios.get(`${TESTRAIL_URL}${proxyPath}`, {
      auth: AUTH,
    });
    res.json(response.data);
  } catch (error) {
    console.error("❌ Proxy error:", error.message);
    if (error.response) {
      console.error("TestRail response error:", error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ TestRail Proxy Server running on port ${PORT}`);
});

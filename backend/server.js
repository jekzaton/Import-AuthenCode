require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {  testConnection } = require('./config/db');
const { readdirSync } = require('fs')

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

// ─── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  await testConnection();
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
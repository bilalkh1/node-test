const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const authRoutes = require("./routes/user-routes");

const app = express();

// Body Parser
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Cors
app.use(cors());

app.use("/api/auth", authRoutes);

module.exports = app;
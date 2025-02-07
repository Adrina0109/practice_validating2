const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();
const Schema = require('./pages/Schema')
const app = express();
app.use(express.json());

mongoose.connect(process.env.URL)
  .then(() => console.log("Connected"))
  .catch(err => console.error("Connection Failed:", err));

app.post("/login", async (req, res) => {
  const { email, password } = req.body;


  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {

    const user = await Schema.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }


    res.status(200).json({ message: "Login successful", user });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const port = 3010;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

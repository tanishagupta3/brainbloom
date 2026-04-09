// ===== IMPORTS =====
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===== INIT =====
const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== MONGO CONNECT =====
// 👉 Replace with your Railway Mongo URL
mongoose.connect("mongodb://mongo:LSOUcJYYodCFltatnLaWCIAfUnWFdGmI@mainline.proxy.rlwy.net:16352")
  .then(() => console.log("MongoDB connected 🚀"))
  .catch(err => console.log(err));

// ===== USER MODEL =====
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

// ===== ROUTES =====

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// ===== REGISTER =====
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User registered ✅" });

  } catch (err) {
    res.json({ message: "Error registering user" });
  }
});

// ===== LOGIN =====
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ message: "Wrong password" });
    }

    // create token
    const token = jwt.sign(
      { id: user._id },
      "SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful 😎",
      token
    });

  } catch (err) {
    res.json({ message: "Login error" });
  }
});

// ===== CHAT (TEMP AI) =====
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    // fake AI (replace later)
    const reply = "AI says: " + message;

    res.json({ reply });

  } catch (err) {
    res.json({ reply: "Error occurred" });
  }
});

// ===== START SERVER =====
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000 🚀");
});
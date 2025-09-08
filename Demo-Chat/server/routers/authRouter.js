const express = require("express");
const jwt = require("jsonwebtoken");
const usersBll = require("../BLL/usersBLL");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await usersBll.getUserByUsername(username);
    if (!user) {
      return res.status(401).send("Invalid username or password");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid username or password");
    }
    const userId = user._id;
    const ACCESS_SECRET_TOKEN = process.env.JWT_KEY;

    const accessToken = jwt.sign({ id: userId }, ACCESS_SECRET_TOKEN);

    return res.status(200).send({ accessToken, id: userId });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/register", async (req, res) => {
  try {
    const obj = req.body;
    const user = await usersBll.getUserByUsername(obj.username);
    if (user) {
      return res.status(409).send("Username already exists");
    }
    const hashedPassword = await bcrypt.hash(obj.password, 10);
    obj.password = hashedPassword;
    await usersBll.addUser(obj);
    return res.status(200).send("User created");
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/access", async (req, res) => {
  try {
    const token = req.headers["xaccesstoken"];
    if (!token) {
      return res.status(401).send("Access token missing");
    }
    jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
      if (err) {
        return res.status(403).send("Invalid access token");
      }
      const user = await usersBll.getUserById(decoded.id);
      if (!user) {
        return res.status(404).send("User not found");
      }
      return res.status(200).send("Access granted");
    });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

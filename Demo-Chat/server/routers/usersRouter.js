const express = require("express");
const UsersBLL = require("../BLL/usersBLL");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await UsersBLL.getAllUsers();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:getemail/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await UsersBLL.getUserByUsername(username);
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UsersBLL.getUserById(id);
    res.send(user);
  } catch (error) {
    res.send("none");
  }
});

router.post("/", async (req, res) => {
  try {
    const obj = req.body;
    const result = await UsersBLL.addUser(obj);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const obj = req.body;
    const result = await UsersBLL.updateUser(id, obj);
    return res.json(result);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await UsersBLL.deleteUser(id);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

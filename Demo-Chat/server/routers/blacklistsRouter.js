const express = require("express");
const BLBLL = require("../BLL/blacklistsBLL");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const blacklists = await BLBLL.getAllLists();
    res.send(blacklists);
  } catch (error) {
    console.error("Error fetching BlackLists:", error);
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const list = await BLBLL.getListById(id);
    res.send(list);
  } catch (error) {
    res.send("none");
  }
});

router.post("/", async (req, res) => {
  try {
    const obj = req.body;
    const list = await BLBLL.addList(obj);
    res.send(list);
  } catch (error) {
    res.send("none");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const obj = req.body;
    const result = await BLBLL.updateList(id, obj);
    return res.json(result);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await BLBLL.deleteList(id);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

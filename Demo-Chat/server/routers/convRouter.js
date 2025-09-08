const express = require("express");
const ConvBLL = require("../BLL/convBLL");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const convs = await ConvBLL.getAllConversations();
    console.log(`Fetched ${convs.length} conversations`);
    res.send(convs);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const conv = await ConvBLL.getConversationById(id);
    res.send(conv);
  } catch (error) {
    res.send("none");
  }
});

router.get("/name/:groupName", async (req, res) => {
  try {
    const { groupName } = req.params;
    const conv = await ConvBLL.getConversationByName(groupName);
    res.send(conv);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const obj = req.body;
    const isConv = await ConvBLL.getConversationByName(obj.groupName);
    if (isConv) {
      return res.status(401).send({ msg: "Group alredy exists" });
    }
    const result = await ConvBLL.addConversation(obj);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const obj = req.body;
    const result = await ConvBLL.updateConversation(id, obj);
    return res.json(result);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ConvBLL.deleteConversation(id);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

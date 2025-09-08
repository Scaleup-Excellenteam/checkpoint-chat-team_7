const express = require("express");
const BLDBLL = require("../BLL/blaclistDomainsBLL");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const blacklistDomains = await BLDBLL.getAllDomains();
    res.send(blacklistDomains);
  } catch (error) {
    console.error("Error fetching BlacklistDomains:", error);
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const domain = await BLDBLL.getDomainById(id);
    res.send(domain);
  } catch (error) {
    res.send("none");
  }
});

router.post("/", async (req, res) => {
  try {
    const obj = req.body;
    const isDomain = await BLDBLL.getDomainByTitle(obj.domain);
    if (isDomain) {
      return res.status(401).send({ msg: "Domain alredy exists" });
    }
    const result = await BLDBLL.addDomain(obj);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const obj = req.body;
    const result = await BLDBLL.updateDomain(id, obj);
    return res.json(result);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await BLDBLL.deleteDomain(id);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

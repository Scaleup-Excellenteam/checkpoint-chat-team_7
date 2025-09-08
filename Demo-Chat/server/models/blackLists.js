const mongoose = require("mongoose");

const blacklistsSchema = new mongoose.Schema(
  {
    listCategory: String,
    blacklist: [],
  },
  { versionKey: false, timestamps: true }
);

const blacklists = mongoose.model("blacklist", blacklistsSchema, "blacklists");

module.exports = blacklists;

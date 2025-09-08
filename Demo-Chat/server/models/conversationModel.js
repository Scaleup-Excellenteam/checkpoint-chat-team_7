const mongoose = require("mongoose");

const convSchema = new mongoose.Schema(
  {
    members: [],
    messages: [],
    groupName: String,
    groupAdmin: String,
    groupAdminId: String,
  },
  { versionKey: false, timestamps: true }
);

const Conv = mongoose.model("conversation", convSchema, "conversations");

module.exports = Conv;

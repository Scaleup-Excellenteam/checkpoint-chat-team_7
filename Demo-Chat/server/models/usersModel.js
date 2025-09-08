const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: String,
    username: String,
    email: String,
    password: String,
    conversations: [], // array of conversation IDs
  },
  { versionKey: false, timestamps: true }
);

const User = mongoose.model("user", userSchema, "users");

module.exports = User;

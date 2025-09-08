const mongoose = require("mongoose");

const blacklistDomainsSchema = new mongoose.Schema(
  {
    domain: String,
    description: String,
  },
  { versionKey: false, timestamps: true }
);

const blacklistDomain = mongoose.model(
  "blacklistDomain",
  blacklistDomainsSchema,
  "blacklistDomains"
);

module.exports = blacklistDomain;

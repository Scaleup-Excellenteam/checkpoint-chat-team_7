const BLD = require("../models/blackListDomains");

// Get All
const getAllDomains = () => {
  return BLD.find();
};

// Get By ID
const getDomainById = (id) => {
  return BLD.findById(id);
};

const getDomainByTitle = (domain) => {
  return BLD.findOne({ domain });
};

// Post
const addDomain = async (obj) => {
  const domain = new BLD(obj);
  await domain.save();
  return "Added";
};

// Put
const updateDomain = async (id, obj) => {
  const result = await BLD.findByIdAndUpdate(id, obj);
  return "Updated!";
};

// Delete
const deleteDomain = async (id) => {
  await BLD.findByIdAndDelete(id);
  return "Deleted!";
};

module.exports = {
  getAllDomains,
  getDomainById,
  getDomainByTitle,
  addDomain,
  updateDomain,
  deleteDomain,
};

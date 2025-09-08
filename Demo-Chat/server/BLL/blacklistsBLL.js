const BL = require("../models/blackLists");

// Get All
const getAllLists = () => {
  return BL.find();
};

// Get By ID
const getListById = (id) => {
  return BL.findById(id);
};

// Post
const addList = async (obj) => {
  const list = new BL(obj);
  await list.save();
  return "Added";
};

// Put
const updateList = async (id, obj) => {
  const result = await BL.findByIdAndUpdate(id, obj);
  return "Updated!";
};

// Delete
const deleteList = async (id) => {
  await BL.findByIdAndDelete(id);
  return "Deleted!";
};

module.exports = {
  getAllLists,
  getListById,
  addList,
  updateList,
  deleteList,
};

const Conv = require("../models/conversationModel");

// Get All
const getAllConversations = () => {
  return Conv.find();
};

// Get By ID
const getConversationById = (id) => {
  return Conv.findById(id);
};

const getConversationByName = (name) => {
  return Conv.findOne({ groupName: name });
};

// Post
const addConversation = async (obj) => {
  const conversation = new Conv(obj);
  await conversation.save();
  return "Created!";
};

// Put
const updateConversation = async (id, obj) => {
  console.log(`Updating conversation ${id} with:`, obj);
  const result = await Conv.findByIdAndUpdate(id, obj, { new: true });
  console.log(`Update result:`, result);
  return "Updated!";
};

// Delete
const deleteConversation = async (id) => {
  await Conv.findByIdAndDelete(id);
  return "Deleted!";
};

module.exports = {
  getAllConversations,
  getConversationById,
  getConversationByName,
  addConversation,
  updateConversation,
  deleteConversation,
};

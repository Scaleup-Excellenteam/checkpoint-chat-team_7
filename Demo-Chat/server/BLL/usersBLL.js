const User = require("../models/usersModel");

// Get All
const getAllUsers = () => {
  return User.find();
};

// Get By ID
const getUserById = (id) => {
  return User.findById(id);
};

// Get By Username
const getUserByUsername = (username) => {
  return User.findOne({ username });
};

// Post
const addUser = async (obj) => {
  const user = new User(obj);
  await user.save();
  return "Created!";
};

// Put
const updateUser = async (id, obj) => {
  await User.findByIdAndUpdate(id, obj);
  return "Updated!";
};

// Delete
const deleteUser = async (id) => {
  await User.findByIdAndDelete(id);
  return "Deleted!";
};

module.exports = {
  getAllUsers,
  getUserByUsername,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
};

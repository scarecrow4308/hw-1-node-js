const {
  registartion,
  login,
  logout,
  getCurrentUser,
  subscriptionChange,
} = require("../services/authService");

const registrationController = async (req, res) => {
  const { email, password } = req.body;
  const user = await registartion(email, password);
  res.status(201).json({ user });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await login(email, password);

  res.status(200).json(user);
};

const logoutController = async (req, res) => {
  const { _id } = req.user;

  await logout(_id);

  res.status(204).json("");
};

const currentController = async (req, res) => {
  const { _id } = req.user;

  const user = await getCurrentUser(_id);

  res.status(200).json(user);
};

const subscriptionController = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  const user = await subscriptionChange(_id, subscription);

  res.status(200).json(user);
};

module.exports = {
  registrationController,
  loginController,
  logoutController,
  currentController,
  subscriptionController,
};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../db/userModel");
const { NotAuthorizedError, ConflictdError } = require("../helpers/errors");

async function registartion(email, password) {
  const user = new User({
    email,
    password,
  });

  const usedEmail = await User.findOne({ email: email });

  if (usedEmail) {
    throw new ConflictdError("Email in use");
  }

  const res = await user.save();

  return { email, subscription: res.subscription };
}

async function login(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotAuthorizedError("Email or password is wrong");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new NotAuthorizedError("Email or password is wrong");
  }

  const token = jwt.sign(
    { _id: user._id, subscription: user.subscription },
    process.env.JWT_SECRET,
    { expiresIn: "23h" }
  );

  await User.findOneAndUpdate({ email }, { $set: { token } });
  return { token, user: { email, subscription: user.subscription } };
}

async function logout(_id) {
  await User.findOneAndUpdate({ _id }, { $set: { token: null } });
}

async function getCurrentUser(_id) {
  const user = await User.findById(_id);

  if (!user) {
    throw new NotAuthorizedError("Email or password is wrong");
  }

  return { email: user.email, subscription: user.subscription };
}

async function subscriptionChange(_id, subscription) {
  const subs = ["starter", "pro", "business"];

  if (!subs.includes(subscription)) {
    throw new ConflictdError("Incorrect type of subscription");
  }

  const user = await User.findOneAndUpdate({ _id }, { $set: { subscription } });

  if (!user) {
    throw new NotAuthorizedError("Email or password is wrong");
  }

  return { email: user.email, subscription };
}

module.exports = {
  registartion,
  login,
  logout,
  getCurrentUser,
  subscriptionChange,
};

const express = require("express");

const {
  registrationController,
  loginController,
  logoutController,
  currentController,
  subscriptionController,
} = require("../../controllers/authController");

const { asyncWrapper } = require("../../helpers/apiHelpers");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { authValidation } = require("../../middlewares/validation");

const router = express.Router();

router.post("/register", authValidation, asyncWrapper(registrationController));

router.post("/login", authValidation, asyncWrapper(loginController));

router.post("/logout", authMiddleware, asyncWrapper(logoutController));

router.post("/current", authMiddleware, asyncWrapper(currentController));

router.patch("/", authMiddleware, asyncWrapper(subscriptionController));

module.exports = router;

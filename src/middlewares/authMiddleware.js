const jwt = require("jsonwebtoken");
const { NotAuthorizedError } = require("../helpers/errors");
const { User } = require("../db/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new NotAuthorizedError("Not authorized");
    }

    const [tokenType, token] = authorization.split(" ");

    if (!token) {
      throw new NotAuthorizedError("Not authorized");
    }

    const { user, err } = await jwt.verify(
      token,
      process.env.JWT_SECRET,
      async function (err, decoded) {
        if (err) {
          await User.findOneAndUpdate({ token }, { $set: { token: null } });
        }
        return { user: decoded, err };
      }
    );

    const validUser = await User.findById(user._id);

    if (!validUser || !user || validUser.token !== token || err) {
      throw new NotAuthorizedError("Not authorized");
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    next(new NotAuthorizedError("Not authorized"));
  }
};

module.exports = { authMiddleware };

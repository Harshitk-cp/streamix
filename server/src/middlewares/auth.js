import { verifyToken } from "../utils/generateTokens.js";
import asyncHandler from "express-async-handler";
import { check, validationResult } from "express-validator";
// import { ValidationError } from "sequelize";
import Logger from "../logger.js";
import { errorHandler } from "./error.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    try {
      const decoded = verifyToken(bearerToken);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Unauthorized");
    }
  } else {
    res.status(401);
    throw new Error("Unauthorized");
  }
});

const createErrorObject = (errors) => {
  const errorObject = [];
  errors.forEach((error) => {
    let err = {
      [error.param]: error.msg,
    };
    errorObject.push(err);
  });

  return errorObject;
};

const checkCreateRoomFields = asyncHandler(async (req, res, next) => {
  if (!req.body.room_name) {
    check("room_name").not().isEmpty().withMessage("Room name is required");
  } else {
    check("room_name")
      .isString()
      .isLength({ min: 3, max: 20 })
      .withMessage("Room name must be between 5 and 20 characters");
  }

  if (req.body.password) {
    check("password")
      .not()
      .isEmpty()
      .isLength({ min: 5, max: 15 })
      .withMessage("Password should be between 5 and 15 characters");
  }

  const errors = validationResult(req);

  if (errors) {
    Logger.error("ROOM FIELD", createErrorObject(errors.array()));

    res.send({
      error: createErrorObject(errors.array()),
    });
  } else {
    next();
  }
});

const customSocialAuthenticate = (socialAuth) => {
  return (req, res, next) => {
    passport.authenticate(socialAuth, {
      state: JSON.stringify({ _socket: req.query.socketId }),
    })(req, res, next);
  };
};

export {
  authMiddleware,
  createErrorObject,
  checkCreateRoomFields,
  customSocialAuthenticate,
};

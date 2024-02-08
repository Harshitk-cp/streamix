import jwt from "jsonwebtoken";

export const google = (req, res) => {
  const io = req.app.get("io");

  const { details, _socket } = req.user;

  const token = jwt.sign(details.toObject(), process.env.JWT_SECRET, {
    expiresIn: 18000,
  });

  const response = {
    auth: true,
    token: `Bearer ${token}`,
    user: details,
  };

  io.to(_socket).emit("google", JSON.stringify(response));
};

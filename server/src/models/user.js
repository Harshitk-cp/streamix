import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// const Email = new Schema({
//   address: ,
//   validated: { type: Boolean, default: false },
// });

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can not be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true,
    },
    password: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: [true, "can not be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
    },
    profile: {
      firstName: String,
      lastName: String,
      avatar: String,
    },
    token: String,
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, SALT_ROUNDS);
  next();
});

UserSchema.methods.comparePassword = function (plaintext, callback) {
  return callback(null, bcrypt.compareSync(plaintext, this.password));
};

export default mongoose.model("User", UserSchema);

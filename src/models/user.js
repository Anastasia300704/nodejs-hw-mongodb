import mongoose from "mongoose";
import bcrypt from "bcrypt";

const DEFAULT_AVATAR = 'https://ac.goit.global/fullstack/react/default-avatar.jpg';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.username) this.username = this.email;
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model("User", userSchema);

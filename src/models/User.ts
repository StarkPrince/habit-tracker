// src/models/User.ts
import mongoose, { Schema, model, models } from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = models.User || model<IUser>("User", UserSchema);

export default User;

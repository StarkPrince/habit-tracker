// src/models/Habit.ts
import mongoose, { Schema, model, models } from "mongoose";

export interface IHabit extends mongoose.Document {
  _id: string;
  user: mongoose.Types.ObjectId;
  name: string;
  createdAt: Date;
  logs: Date[];
}

const HabitSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  logs: { type: [Date], default: [] },
});

// Ensure uniqueness per user
HabitSchema.index({ user: 1, name: 1 }, { unique: true });

const Habit = models.Habit || model<IHabit>("Habit", HabitSchema);

export default Habit;

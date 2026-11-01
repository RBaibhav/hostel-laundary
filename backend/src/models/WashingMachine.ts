import mongoose, { Document, Schema, Model, Types } from "mongoose";

export type MachineStatus = "AVAILABLE" | "IN_USE" | "OUT_OF_ORDER";

export interface IWashingMachine extends Document {
  machineNumber: string;
  location: string;
  status: MachineStatus;
  currentUser?: Types.ObjectId | null;
  estimatedEndTime?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const washingMachineSchema = new Schema<IWashingMachine>(
  {
    machineNumber: {
      type: String,
      required: [true, "Machine number is required"],
      unique: true,
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "IN_USE", "OUT_OF_ORDER"],
      default: "AVAILABLE",
    },
    currentUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    estimatedEndTime: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

washingMachineSchema.index({ status: 1 });

export const WashingMachine: Model<IWashingMachine> =
  mongoose.model<IWashingMachine>("WashingMachine", washingMachineSchema);

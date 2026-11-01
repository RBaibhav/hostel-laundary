import mongoose, { Document, Schema, Model, Types } from "mongoose";

export type SessionStatus = "ACTIVE" | "COMPLETED";

export interface ILaundrySession extends Document {
  user: Types.ObjectId;
  machine: Types.ObjectId;
  startTime: Date;
  estimatedEndTime: Date;
  endTime?: Date | null;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const laundrySessionSchema = new Schema<ILaundrySession>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"]
    },
    machine: {
      type: Schema.Types.ObjectId,
      ref: "WashingMachine",
      required: [true, "Machine reference is required"]
    },
    startTime: {
      type: Date,
      default: Date.now,
      required: true
    },
    estimatedEndTime: {
      type: Date,
      required: [true, "Estimated end time is required"]
    },
    endTime: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED"],
      default: "ACTIVE"
    }
  },
  {
    timestamps: true
  }
);

laundrySessionSchema.index(
  { user: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "ACTIVE" }
  }
);

laundrySessionSchema.index({ machine: 1, status: 1 });
laundrySessionSchema.index({ user: 1, createdAt: -1 });

export const LaundrySession: Model<ILaundrySession> =
  mongoose.model<ILaundrySession>("LaundrySession", laundrySessionSchema);

import { Request, Response, NextFunction } from "express";
import { WashingMachine } from "../models/WashingMachine";
import { LaundrySession } from "../models/LaundrySession";
import { ApiError } from "../utils/ApiError";

export const createMachine = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { machineNumber, location } = req.body;
    const existing = await WashingMachine.findOne({ machineNumber });

    if (existing) {
      throw new ApiError(409, `A machine with number "${machineNumber}" already exists`);
    }

    const machine = await WashingMachine.create({
      machineNumber,
      location,
      status: "AVAILABLE"
    });

    res.status(201).json({
      success: true,
      message: "Washing machine created successfully",
      data: machine
    });
  } catch (error) {
    next(error);
  }
};

export const updateMachine = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const machine = await WashingMachine.findById(id);

    if (!machine) {
      throw new ApiError(404, "Washing machine not found");
    }

    if (updates.machineNumber && updates.machineNumber !== machine.machineNumber) {
      const existing = await WashingMachine.findOne({
        machineNumber: updates.machineNumber,
        _id: { $ne: id }
      });

      if (existing) {
        throw new ApiError(
          409,
          `A machine with number "${updates.machineNumber}" already exists`
        );
      }

      machine.machineNumber = updates.machineNumber;
    }

    if (updates.location) {
      machine.location = updates.location;
    }

    if (updates.status && updates.status !== machine.status) {
      const activeSession = await LaundrySession.findOne({
        machine: id,
        status: "ACTIVE"
      });

      if (activeSession) {
        throw new ApiError(
          409,
          "Cannot change machine status while an active laundry session is in progress"
        );
      }

      machine.status = updates.status;

      if (updates.status === "OUT_OF_ORDER" || updates.status === "AVAILABLE") {
        machine.currentUser = null;
        machine.estimatedEndTime = null;
      }
    }

    await machine.save();

    const populatedMachine = await WashingMachine.findById(machine._id).populate(
      "currentUser",
      "name email roomNumber"
    );

    res.status(200).json({
      success: true,
      message: "Washing machine updated successfully",
      data: populatedMachine
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMachine = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const machine = await WashingMachine.findById(id);

    if (!machine) {
      throw new ApiError(404, "Washing machine not found");
    }

    const activeSession = await LaundrySession.findOne({
      machine: id,
      status: "ACTIVE"
    });

    if (activeSession || machine.status === "IN_USE") {
      throw new ApiError(
        409,
        "Cannot delete machine while it has an active laundry session"
      );
    }

    await WashingMachine.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Washing machine deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

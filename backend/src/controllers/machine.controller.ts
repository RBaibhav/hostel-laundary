import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { WashingMachine, MachineStatus } from "../models/WashingMachine";
import { ApiError } from "../utils/ApiError";

export const getMachines = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const status = req.query.status as MachineStatus | undefined;
    const filter: Record<string, unknown> = status ? { status } : {};

    const machines = await WashingMachine.find(filter)
      .populate("currentUser", "name email roomNumber")
      .sort({ machineNumber: 1 });

    res.status(200).json({
      success: true,
      message: "Machines retrieved successfully",
      data: machines
    });
  } catch (error) {
    next(error);
  }
};

export const getMachineSummary = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [total, available, inUse, outOfOrder] = await Promise.all([
      WashingMachine.countDocuments(),
      WashingMachine.countDocuments({ status: "AVAILABLE" }),
      WashingMachine.countDocuments({ status: "IN_USE" }),
      WashingMachine.countDocuments({ status: "OUT_OF_ORDER" })
    ]);

    res.status(200).json({
      success: true,
      message: "Dashboard summary retrieved successfully",
      data: {
        total,
        available,
        inUse,
        outOfOrder
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMachineById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      throw new ApiError(400, `Invalid machine ID: "${id}"`);
    }

    const machine = await WashingMachine.findById(id).populate(
      "currentUser",
      "name email roomNumber"
    );

    if (!machine) {
      throw new ApiError(404, "Washing machine not found");
    }

    res.status(200).json({
      success: true,
      message: "Machine details retrieved successfully",
      data: machine
    });
  } catch (error) {
    next(error);
  }
};

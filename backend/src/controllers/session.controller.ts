import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { LaundrySession } from "../models/LaundrySession";
import { WashingMachine } from "../models/WashingMachine";
import { ApiError } from "../utils/ApiError";

export const startSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const { machineId, duration } = req.body;

    const existingActiveSession = await LaundrySession.findOne({
      user: userId,
      status: "ACTIVE"
    });

    if (existingActiveSession) {
      throw new ApiError(
        409,
        "You already have an active laundry session. Please complete it before starting a new one."
      );
    }

    const startTime = new Date();
    const estimatedEndTime = new Date(startTime.getTime() + duration * 60 * 1000);

    const machine = await WashingMachine.findOneAndUpdate(
      {
        _id: machineId,
        status: "AVAILABLE"
      },
      {
        status: "IN_USE",
        currentUser: userId,
        estimatedEndTime
      },
      {
        returnDocument: "after"
      }
    );

    if (!machine) {
      const machineExists = await WashingMachine.findById(machineId);
      if (!machineExists) {
        throw new ApiError(404, "Washing machine not found");
      }
      throw new ApiError(409, "Machine is currently unavailable");
    }

    let session;
    try {
      session = await LaundrySession.create({
        user: userId,
        machine: machineId,
        startTime,
        estimatedEndTime,
        status: "ACTIVE"
      });
    } catch (createError) {
      await WashingMachine.findByIdAndUpdate(machineId, {
        status: "AVAILABLE",
        currentUser: null,
        estimatedEndTime: null
      });
      throw createError;
    }

    const populatedSession = await LaundrySession.findById(session._id)
      .populate("machine", "machineNumber location status estimatedEndTime")
      .populate("user", "name email roomNumber");

    res.status(201).json({
      success: true,
      message: "Laundry session started successfully",
      data: populatedSession
    });
  } catch (error) {
    next(error);
  }
};

export const endSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const { sessionId } = req.body;

    const session = await LaundrySession.findById(sessionId);
    if (!session) {
      throw new ApiError(404, "Laundry session not found");
    }

    if (session.user.toString() !== userId && req.user?.role !== "ADMIN") {
      throw new ApiError(403, "You are not authorized to end another user's session");
    }

    if (session.status !== "ACTIVE") {
      throw new ApiError(400, "Laundry session has already been completed");
    }

    const endTime = new Date();
    session.status = "COMPLETED";
    session.endTime = endTime;
    await session.save();

    await WashingMachine.findByIdAndUpdate(session.machine, {
      status: "AVAILABLE",
      currentUser: null,
      estimatedEndTime: null
    });

    const populatedSession = await LaundrySession.findById(session._id)
      .populate("machine", "machineNumber location status")
      .populate("user", "name email roomNumber");

    res.status(200).json({
      success: true,
      message: "Laundry session ended successfully",
      data: populatedSession
    });
  } catch (error) {
    next(error);
  }
};

export const getMyActiveSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const activeSession = await LaundrySession.findOne({
      user: userId,
      status: "ACTIVE"
    }).populate("machine", "machineNumber location status estimatedEndTime");

    if (!activeSession) {
      res.status(200).json({
        success: true,
        message: "No active laundry session found",
        data: null
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Active session retrieved successfully",
      data: activeSession
    });
  } catch (error) {
    next(error);
  }
};

export const getMySessionHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const sessions = await LaundrySession.find({
      user: userId
    })
      .populate("machine", "machineNumber location status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Session history retrieved successfully",
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

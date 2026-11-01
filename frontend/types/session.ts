import { MachineStatus } from "./machine";

export type SessionStatus = "ACTIVE" | "COMPLETED";

export interface SessionMachineInfo {
  _id: string;
  machineNumber: string;
  location: string;
  status: MachineStatus;
  estimatedEndTime?: string | null;
}

export interface LaundrySession {
  _id: string;
  user:
    | string
    | {
        _id: string;
        name: string;
        email: string;
        roomNumber: string;
      };
  machine: SessionMachineInfo;
  startTime: string;
  estimatedEndTime: string;
  endTime?: string | null;
  status: SessionStatus;
  createdAt: string;
  updatedAt?: string;
}


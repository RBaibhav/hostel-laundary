export type MachineStatus = "AVAILABLE" | "IN_USE" | "OUT_OF_ORDER";

export type MachineFilter = "ALL" | MachineStatus;

export interface MachineCurrentUser {
  _id?: string;
  name?: string;
  email?: string;
  roomNumber?: string;
}

export interface WashingMachine {
  _id: string;
  machineNumber: string;
  location: string;
  status: MachineStatus;
  currentUser?: MachineCurrentUser | null;
  estimatedEndTime?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface MachineSummary {
  total: number;
  available: number;
  inUse: number;
  outOfOrder: number;
}


import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { AuthResponse } from "@/types/user";
import { WashingMachine, MachineSummary, MachineStatus } from "@/types/machine";
import { LaundrySession } from "@/types/session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Array<{ field: string; message: string }>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public errors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("laundry_token");
};

// 1. Axios Instance Setup
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

// 2. Request Interceptor: Automatically attach Bearer token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Response Interceptor: Normalize errors & handle expired sessions
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    const status = error.response?.status || 500;
    const responseData = error.response?.data;

    if (status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("laundry_token");
      localStorage.removeItem("laundry_user");
    }

    const message = responseData?.message || error.message || "An unexpected error occurred";
    return Promise.reject(new ApiError(message, status, responseData?.errors));
  }
);

// Generic HTTP request helpers
const get = async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
  const res = await apiClient.get<ApiResponse<T>>(url, { params });
  return res.data.data;
};

const post = async <T>(url: string, body?: unknown): Promise<T> => {
  const res = await apiClient.post<ApiResponse<T>>(url, body);
  return res.data.data;
};

const patch = async <T>(url: string, body?: unknown): Promise<T> => {
  const res = await apiClient.patch<ApiResponse<T>>(url, body);
  return res.data.data;
};

const del = async <T = { success: boolean; message: string }>(url: string): Promise<T> => {
  const res = await apiClient.delete<ApiResponse<T>>(url);
  return (res.data.data ?? { success: true, message: res.data.message || "Deleted" }) as T;
};

// --- Modular API Services ---

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    post<AuthResponse>("/auth/login", credentials),

  register: (payload: { name: string; email: string; password: string; roomNumber: string }) =>
    post<AuthResponse>("/auth/register", payload)
};

export const machineApi = {
  getAll: (status?: MachineStatus) =>
    get<WashingMachine[]>("/machines", status ? { status } : undefined),

  getSummary: () =>
    get<MachineSummary>("/machines/summary"),

  getById: (id: string) =>
    get<WashingMachine>(`/machines/${id}`),

  create: (data: { machineNumber: string; location: string }) =>
    post<WashingMachine>("/machines", data),

  update: (id: string, data: { machineNumber?: string; location?: string; status?: MachineStatus }) =>
    patch<WashingMachine>(`/machines/${id}`, data),

  delete: (id: string) =>
    del<{ success: boolean; message: string }>(`/machines/${id}`)
};

export const sessionApi = {
  start: (data: { machineId: string; duration: number }) =>
    post<LaundrySession>("/sessions/start", data),

  end: (sessionId: string) =>
    patch<LaundrySession>("/sessions/end", { sessionId }),

  getMyActive: () =>
    get<LaundrySession | null>("/sessions/my-active"),

  getMyHistory: () =>
    get<LaundrySession[]>("/sessions/my-history")
};

// Unified client export for clean, backward-compatible usage
export const api = {
  auth: authApi,
  machines: machineApi,
  sessions: sessionApi
};

export default api;

import express, { Express, Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import machineRoutes from "./routes/machine.routes";
import sessionRoutes from "./routes/session.routes";
import { errorHandler } from "./middleware/error.middleware";

const app: Express = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const health = (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString()
  });
};

app.get("/health", health);
app.get("/api/health", health);
app.use("/api/auth", authRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/sessions", sessionRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found`
  });
});

app.use(errorHandler);

export default app;
export { app };

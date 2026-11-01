import "dotenv/config";
import { app } from "./app";
import { connectDB, disconnectDB } from "./config/db";

const port = Number(process.env.PORT) || 5000;

async function start() {
  await connectDB();

  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  const stop = async () => {
    server.close();
    await disconnectDB();
    process.exit(0);
  };

  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}

start().catch((error) => {
  console.error("Could not start server:", error);
  process.exit(1);
});

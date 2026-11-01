import mongoose from "mongoose";

export const connectDB = async (): Promise<typeof mongoose> => {
  const mongoURI =
    process.env.MONGODB_URI ||
    (process.env.MONGO_ROOT_USER && process.env.MONGO_ROOT_PASSWORD
      ? `mongodb://${encodeURIComponent(process.env.MONGO_ROOT_USER)}:${encodeURIComponent(process.env.MONGO_ROOT_PASSWORD)}@localhost:${process.env.MONGO_PORT || "27017"}/${process.env.MONGO_DB_NAME || "laundry_db"}?authSource=admin`
      : undefined);

  if (!mongoURI) {
    console.error("Error: MongoDB connection string or credentials are missing from environment variables.");
    process.exit(1);
    throw new Error("MongoDB URI missing");
  }

  try {
    const connection = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${connection.connection.host}:${connection.connection.port}/${connection.connection.name}`);
    return connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected successfully");
  } catch (error) {
    console.error("Error disconnecting MongoDB:", error);
  }
};

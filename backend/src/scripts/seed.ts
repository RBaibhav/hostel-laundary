import path from "path";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { connectDB, disconnectDB } from "../config/db";
import { User } from "../models/User";
import { WashingMachine } from "../models/WashingMachine";

const seed = async () => {
  console.log("🌱 Starting LaundryMate Database Seeder...\n");

  await connectDB();

  // 1. Create or Promote Admin User
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@hostel.edu").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

  let admin = await User.findOne({ email: adminEmail });

  if (admin) {
    if (admin.role !== "ADMIN") {
      admin.role = "ADMIN";
      await admin.save();
      console.log(`✓ Promoted existing user "${adminEmail}" to ADMIN role.`);
    } else {
      console.log(`✓ Admin user "${adminEmail}" already exists.`);
    }
  } else {
    admin = await User.create({
      name: "Hostel Warden",
      email: adminEmail,
      password: adminPassword,
      roomNumber: "WARDEN-01",
      role: "ADMIN"
    });
    console.log(`✓ Created new Admin user:`);
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Role:     ADMIN`);
  }

  // 2. Optionally seed initial machines if none exist
  const machineCount = await WashingMachine.countDocuments();
  if (machineCount === 0) {
    const initialMachines = [
      { machineNumber: "WM-01", location: "Block A, Ground Floor", status: "AVAILABLE" as const },
      { machineNumber: "WM-02", location: "Block A, Ground Floor", status: "AVAILABLE" as const },
      { machineNumber: "WM-03", location: "Block A, 1st Floor", status: "AVAILABLE" as const },
      { machineNumber: "WM-04", location: "Block B, Ground Floor", status: "AVAILABLE" as const },
      { machineNumber: "WM-05", location: "Block B, 1st Floor", status: "AVAILABLE" as const },
      { machineNumber: "WM-06", location: "Block B, 2nd Floor", status: "AVAILABLE" as const }
    ];

    await WashingMachine.insertMany(initialMachines);
    console.log(`✓ Seeded ${initialMachines.length} initial washing machines.`);
  } else {
    console.log(`ℹ Found ${machineCount} existing washing machines in the database.`);
  }

  console.log("\n Seeding completed successfully!");
  await disconnectDB();
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});


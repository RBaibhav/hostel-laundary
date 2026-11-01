import path from "path";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { app } from "./src/app";
import { connectDB, disconnectDB } from "./src/config/db";
import { User } from "./src/models/User";
import { WashingMachine } from "./src/models/WashingMachine";
import { LaundrySession } from "./src/models/LaundrySession";
import http from "http";

let server: http.Server;
let baseUrl: string;

const runTests = async () => {
  console.log("=== Starting Hostel Laundry Machine Backend Verification Suite ===");

  await connectDB();

  // Bind to port 5005 for testing
  const TEST_PORT = 5005;
  server = app.listen(TEST_PORT, "127.0.0.1");
  baseUrl = `http://127.0.0.1:${TEST_PORT}`;
  console.log(`Test server running at ${baseUrl}`);

  // Clean test data before running
  console.log("\n--- Cleaning previous test data ---");
  await User.deleteMany({ email: { $regex: /@test\.com$/ } });
  await WashingMachine.deleteMany({ machineNumber: { $regex: /^TEST-WM-/ } });
  const testUsers = await User.find({ email: { $regex: /@test\.com$/ } });
  await LaundrySession.deleteMany({ user: { $in: testUsers.map((u) => u._id) } });

  let testsPassed = 0;
  let testsFailed = 0;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      testsPassed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      testsFailed++;
      throw new Error(`Assertion failed: ${message}`);
    }
  };

  try {
    // 1. Health Check
    console.log("\n[1] Testing Health Check");
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, "Health endpoint returns 200");
    assert(healthData.success === true, "Health returns success: true");

    // 2. User Registration
    console.log("\n[2] Testing User Registration");
    const regPayload = {
      name: "Alice Resident",
      email: "alice@test.com",
      password: "password123",
      roomNumber: "B-204"
    };

    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(regPayload)
    });
    const regData = await regRes.json();
    assert(regRes.status === 201, "Registration returns 201");
    assert(regData.success === true, "Registration returns success: true");
    assert(!!regData.data.token, "Registration returns a JWT token");
    assert(regData.data.user.role === "USER", "Default role is USER");
    assert(!regData.data.user.password, "Password hash is not exposed");
    const aliceToken = regData.data.token;
    const aliceId = regData.data.user._id;

    // Test duplicate registration
    const dupRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(regPayload)
    });
    const dupData = await dupRes.json();
    assert(dupRes.status === 409, "Duplicate registration returns 409 Conflict");
    assert(dupData.success === false, "Duplicate registration success is false");

    // Test registration validation error (password too short)
    const invalidRegRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...regPayload, email: "invalid@test.com", password: "123" })
    });
    assert(invalidRegRes.status === 400, "Short password returns 400 Bad Request");

    // 3. User Login
    console.log("\n[3] Testing User Login");
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "alice@test.com", password: "password123" })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, "Valid login returns 200");
    assert(!!loginData.data.token, "Login returns JWT token");

    // Invalid password login
    const badLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "alice@test.com", password: "wrongpassword" })
    });
    assert(badLoginRes.status === 401, "Invalid password returns 401");

    // 4. Register Second User (Bob) and Admin User
    console.log("\n[4] Creating Bob and Admin Users");
    const bobRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Bob Resident",
        email: "bob@test.com",
        password: "password123",
        roomNumber: "C-102"
      })
    });
    const bobData = await bobRes.json();
    const bobToken = bobData.data.token;
    const bobId = bobData.data.user._id;

    // Create Admin user directly in DB to test admin privileges
    await User.deleteOne({ email: "admin@test.com" });
    const adminUser = new User({
      name: "Hostel Warden",
      email: "admin@test.com",
      password: "adminpassword123",
      roomNumber: "ADMIN-01",
      role: "ADMIN"
    });
    await adminUser.save();

    const adminLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@test.com", password: "adminpassword123" })
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginData.data.user.role === "ADMIN", "Admin role confirmed");
    const adminToken = adminLoginData.data.token;

    // 5. Machine Authorization & Admin Endpoints
    console.log("\n[5] Testing Admin Machine Permissions");
    // Standard user attempting to create a machine
    const userCreateMachineRes = await fetch(`${baseUrl}/api/machines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aliceToken}`
      },
      body: JSON.stringify({
        machineNumber: "TEST-WM-01",
        location: "Block A Ground"
      })
    });
    assert(userCreateMachineRes.status === 403, "Non-admin blocked from creating machine (403)");

    // Unauthenticated request
    const unauthRes = await fetch(`${baseUrl}/api/machines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        machineNumber: "TEST-WM-01",
        location: "Block A Ground"
      })
    });
    assert(unauthRes.status === 401, "Unauthenticated request blocked (401)");

    // Admin creates machine
    const adminCreateRes = await fetch(`${baseUrl}/api/machines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        machineNumber: "TEST-WM-01",
        location: "Block A Ground Floor"
      })
    });
    const adminCreateData = await adminCreateRes.json();
    assert(adminCreateRes.status === 201, "Admin creates machine (201)");
    assert(adminCreateData.data.status === "AVAILABLE", "Default status is AVAILABLE");
    const machineId1 = adminCreateData.data._id;

    // Admin creates second machine
    const adminCreateRes2 = await fetch(`${baseUrl}/api/machines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        machineNumber: "TEST-WM-02",
        location: "Block B First Floor"
      })
    });
    const adminCreateData2 = await adminCreateRes2.json();
    const machineId2 = adminCreateData2.data._id;

    // Admin duplicate machine number
    const dupMachineRes = await fetch(`${baseUrl}/api/machines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        machineNumber: "TEST-WM-01",
        location: "Block A Ground Floor"
      })
    });
    assert(dupMachineRes.status === 409, "Duplicate machineNumber returns 409 Conflict");

    // 6. Public Machine Endpoints & Dashboard Summary
    console.log("\n[6] Testing Public Machine Endpoints & Summary");
    const listMachinesRes = await fetch(`${baseUrl}/api/machines`);
    const listMachinesData = await listMachinesRes.json();
    assert(listMachinesRes.status === 200, "Public GET /api/machines returns 200");
    assert(Array.isArray(listMachinesData.data), "Machines returned as array");

    const filteredRes = await fetch(`${baseUrl}/api/machines?status=AVAILABLE`);
    const filteredData = await filteredRes.json();
    assert(filteredRes.status === 200, "Filter by status returns 200");

    const singleMachineRes = await fetch(`${baseUrl}/api/machines/${machineId1}`);
    const singleMachineData = await singleMachineRes.json();
    assert(singleMachineRes.status === 200, "GET /api/machines/:id returns 200");
    assert(singleMachineData.data.machineNumber === "TEST-WM-01", "Correct machine retrieved");

    const summaryRes = await fetch(`${baseUrl}/api/machines/summary`);
    const summaryData = await summaryRes.json();
    assert(summaryRes.status === 200, "GET /api/machines/summary returns 200");
    assert(typeof summaryData.data.total === "number", "Summary total count present");
    assert(typeof summaryData.data.available === "number", "Summary available count present");

    // 7. Start Laundry Session
    console.log("\n[7] Testing Starting Laundry Sessions");
    const startSessionRes = await fetch(`${baseUrl}/api/sessions/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aliceToken}`
      },
      body: JSON.stringify({
        machineId: machineId1,
        duration: 45
      })
    });
    const startSessionData = await startSessionRes.json();
    assert(startSessionRes.status === 201, "Alice starts session on WM-01 (201)");
    assert(startSessionData.data.status === "ACTIVE", "Session status is ACTIVE");
    assert(startSessionData.data.machine.status === "IN_USE", "Machine status transitioned to IN_USE");
    const aliceSessionId = startSessionData.data._id;

    // Check machine status in DB
    const updatedMachine = await WashingMachine.findById(machineId1);
    assert(updatedMachine?.status === "IN_USE", "Machine DB status is IN_USE");
    assert(updatedMachine?.currentUser?.toString() === aliceId, "Machine currentUser matches Alice");

    // Alice attempts to start another session while having an active one
    const aliceSecondSessionRes = await fetch(`${baseUrl}/api/sessions/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aliceToken}`
      },
      body: JSON.stringify({
        machineId: machineId2,
        duration: 30
      })
    });
    assert(aliceSecondSessionRes.status === 409, "User cannot start second active session (409 Conflict)");

    // Bob attempts to start session on machine 1 (which is currently IN_USE)
    const bobOccupiedRes = await fetch(`${baseUrl}/api/sessions/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bobToken}`
      },
      body: JSON.stringify({
        machineId: machineId1,
        duration: 30
      })
    });
    assert(bobOccupiedRes.status === 409, "Occupied machine cannot be claimed (409 Conflict)");

    // 8. Testing Concurrent Race Condition Handling
    console.log("\n[8] Testing Concurrent Race Condition on Available Machine");
    // Register two more test users for concurrent race test
    const userCRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "User C",
        email: "userc@test.com",
        password: "password123",
        roomNumber: "C-301"
      })
    });
    const userCData = await userCRes.json();
    const tokenC = userCData.data.token;

    const userDRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "User D",
        email: "userd@test.com",
        password: "password123",
        roomNumber: "D-401"
      })
    });
    const userDData = await userDRes.json();
    const tokenD = userDData.data.token;

    // Fire two simultaneous requests to claim machineId2
    const [raceRes1, raceRes2] = await Promise.all([
      fetch(`${baseUrl}/api/sessions/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenC}`
        },
        body: JSON.stringify({ machineId: machineId2, duration: 45 })
      }),
      fetch(`${baseUrl}/api/sessions/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenD}`
        },
        body: JSON.stringify({ machineId: machineId2, duration: 45 })
      })
    ]);

    const statuses = [raceRes1.status, raceRes2.status].sort();
    assert(
      statuses[0] === 201 && statuses[1] === 409,
      `Race condition handled atomically: one succeeded (201), one rejected (409) (got ${statuses[0]}, ${statuses[1]})`
    );

    // 9. Active Session & History Endpoints
    console.log("\n[9] Testing Active Session & History Retrieval");
    const aliceActiveRes = await fetch(`${baseUrl}/api/sessions/my-active`, {
      headers: { Authorization: `Bearer ${aliceToken}` }
    });
    const aliceActiveData = await aliceActiveRes.json();
    assert(aliceActiveRes.status === 200, "GET /api/sessions/my-active returns 200");
    assert(aliceActiveData.data._id === aliceSessionId, "Correct active session returned");

    // Bob has no active session
    const bobActiveRes = await fetch(`${baseUrl}/api/sessions/my-active`, {
      headers: { Authorization: `Bearer ${bobToken}` }
    });
    const bobActiveData = await bobActiveRes.json();
    assert(bobActiveData.data === null, "Bob active session is null");

    // 10. End Laundry Session
    console.log("\n[10] Testing Ending Laundry Session");
    // Bob tries to end Alice's session
    const bobEndAliceRes = await fetch(`${baseUrl}/api/sessions/end`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bobToken}`
      },
      body: JSON.stringify({ sessionId: aliceSessionId })
    });
    assert(bobEndAliceRes.status === 403, "User cannot end another user's session (403 Forbidden)");

    // Alice ends her own session
    const aliceEndRes = await fetch(`${baseUrl}/api/sessions/end`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aliceToken}`
      },
      body: JSON.stringify({ sessionId: aliceSessionId })
    });
    const aliceEndData = await aliceEndRes.json();
    assert(aliceEndRes.status === 200, "Alice ends her session successfully (200)");
    assert(aliceEndData.data.status === "COMPLETED", "Session status changed to COMPLETED");
    assert(!!aliceEndData.data.endTime, "endTime recorded");

    // Check machine 1 is now AVAILABLE again
    const machineAfterEnd = await WashingMachine.findById(machineId1);
    assert(machineAfterEnd?.status === "AVAILABLE", "Machine reset to AVAILABLE");
    assert(machineAfterEnd?.currentUser === null, "currentUser cleared on machine");

    // Alice trying to end the already completed session again
    const alreadyEndedRes = await fetch(`${baseUrl}/api/sessions/end`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aliceToken}`
      },
      body: JSON.stringify({ sessionId: aliceSessionId })
    });
    assert(alreadyEndedRes.status === 400, "Ending already completed session returns 400");

    // Session history
    const historyRes = await fetch(`${baseUrl}/api/sessions/my-history`, {
      headers: { Authorization: `Bearer ${aliceToken}` }
    });
    const historyData = await historyRes.json();
    assert(historyRes.status === 200, "GET /api/sessions/my-history returns 200");
    assert(historyData.data.length >= 1, "Alice history contains completed session");

    // 11. Machine Protection & Deletion
    console.log("\n[11] Testing Machine Modification & Deletion Guardrails");
    // Machine 2 has an active session from the race condition earlier
    // Attempting to delete machine 2 with active session should fail
    const deleteOccupiedRes = await fetch(`${baseUrl}/api/machines/${machineId2}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(deleteOccupiedRes.status === 409, "Cannot delete machine with active session (409 Conflict)");

    // Attempting to mark machine 2 OUT_OF_ORDER while active should fail
    const patchOccupiedRes = await fetch(`${baseUrl}/api/machines/${machineId2}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: "OUT_OF_ORDER" })
    });
    assert(patchOccupiedRes.status === 409, "Cannot change status of machine with active session (409 Conflict)");

    // Machine 1 has no active session, Admin can delete it
    const deleteFreeRes = await fetch(`${baseUrl}/api/machines/${machineId1}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(deleteFreeRes.status === 200, "Admin can delete machine with no active session (200)");

    // Verifying it is deleted
    const getDeletedRes = await fetch(`${baseUrl}/api/machines/${machineId1}`);
    assert(getDeletedRes.status === 404, "Deleted machine returns 404");

    // 12. Clean up test users and machines
    console.log("\n[12] Cleaning test data");
    await User.deleteMany({ email: { $regex: /@test\.com$/ } });
    await WashingMachine.deleteMany({ machineNumber: { $regex: /^TEST-WM-/ } });
    await LaundrySession.deleteMany({ user: { $in: [aliceId, bobId] } });

    console.log(`\n======================================================`);
    console.log(`  ALL TESTS PASSED! (${testsPassed} tests passed, ${testsFailed} failed)`);
    console.log(`======================================================\n`);
  } catch (error) {
    console.error("\n❌ Test suite encountered an error:", error);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
    await disconnectDB();
  }
};

runTests();


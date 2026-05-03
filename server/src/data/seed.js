import "dotenv/config";
import { closeDatabase, connectDatabase } from "../config/db.js";
import { populateDemoData } from "./populateDemoData.js";

async function seed() {
  await connectDatabase();
  await populateDemoData({ reset: true });

  console.log("Seed complete.");
  console.log("Admin login: admin@companioncircle.local / Test@123");
  console.log("Client login: client@example.com / Test@123");
  console.log("Provider login: aarav@example.com / Test@123");
  console.log("Provider login: vivaan@example.com / Test@123");

  await closeDatabase();
}

seed().catch(async (error) => {
  console.error("Seed failed:", error);
  await closeDatabase();
  process.exit(1);
});

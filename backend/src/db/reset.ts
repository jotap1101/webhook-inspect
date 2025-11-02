import { db } from "@/db";
import * as schema from "@/db/schema";
import { reset } from "drizzle-seed";

async function main() {
  console.log("Resetting database...");
  await reset(db, schema);
  console.log("Database reset successfully.");
  process.exit(0);
}

main();

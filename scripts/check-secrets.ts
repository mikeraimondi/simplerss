import { execSync } from "node:child_process";
import fs from "node:fs";

// Load .env manually to avoid dependencies
const envContent = fs.readFileSync(".env", "utf-8");
const passwordMatch = envContent.match(/BASIC_AUTH_PASSWORD=(.+)/);

if (!passwordMatch || !passwordMatch[1]) {
    console.log("✅ No BASIC_AUTH_PASSWORD found in .env, skipping check.");
    process.exit(0);
}

const SECRET = passwordMatch[1].trim();

if (SECRET.length < 8) {
    console.log("⚠️ Secret too short, skipping check for safety.");
    process.exit(0);
}

console.log("🔍 Scanning for accidentally committed secrets...");

try {
    // Get all files tracked by git, excluding .env and the scripts directory itself
    const files = execSync("git ls-files", { encoding: "utf-8" })
        .split("\n")
        .filter(f => f && f !== ".env" && !f.startsWith("scripts/"));

    let foundLeak = false;

    for (const file of files) {
        if (!fs.existsSync(file)) continue;

        // Check if file is a directory (shouldn't be from git ls-files but safe)
        if (fs.statSync(file).isDirectory()) continue;

        const content = fs.readFileSync(file, "utf-8");
        if (content.includes(SECRET)) {
            console.error(`❌ ERROR: Found secret in file: ${file}`);
            foundLeak = true;
        }
    }

    if (foundLeak) {
        console.error("\n🛑 COMMIT BLOCKED: Secrets detected in the codebase.");
        console.error("Please remove the hardcoded secrets and use environment variables instead.");
        process.exit(1);
    } else {
        console.log("✅ No secrets found in tracked files.");
        process.exit(0);
    }
} catch (err) {
    console.error("❌ Error running secret check:", err);
    process.exit(1);
}

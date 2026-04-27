#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function main() {
  const inputRaw = readStdin();
  let input = {};
  try {
    input = JSON.parse(inputRaw || "{}");
  } catch {
    input = {};
  }

  const command = String(input.command || "");
  if (!/docker\s+compose\s+up/i.test(command)) {
    console.log(JSON.stringify({ permission: "allow" }));
    return;
  }

  const envPath = path.join(process.cwd(), ".env");
  const examplePath = path.join(process.cwd(), ".env.example");
  const envExists = fs.existsSync(envPath);

  if (envExists) {
    console.log(JSON.stringify({ permission: "allow" }));
    return;
  }

  const msg = fs.existsSync(examplePath)
    ? "Missing .env. Run `cp .env.example .env` (or create .env) before `docker compose up`."
    : "Missing .env and .env.example. Create .env before `docker compose up`.";

  console.log(
    JSON.stringify({
      permission: "ask",
      user_message: msg,
      agent_message: "Hook detected docker compose up without .env present.",
    }),
  );
}

main();

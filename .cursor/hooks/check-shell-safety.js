#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("fs");

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
  const riskyPatterns = [
    /rm\s+-rf/i,
    /del\s+\/s/i,
    /rmdir\s+\/s/i,
    /git\s+push\s+--force/i,
    /git\s+reset\s+--hard/i,
  ];

  const isRisky = riskyPatterns.some((re) => re.test(command));
  if (!isRisky) {
    console.log(JSON.stringify({ permission: "allow" }));
    return;
  }

  console.log(
    JSON.stringify({
      permission: "ask",
      user_message:
        "This shell command looks destructive (rm -rf / reset --hard / force push). Review it carefully before running.",
      agent_message: `Hook flagged a risky shell command: ${command}`,
    }),
  );
}

main();

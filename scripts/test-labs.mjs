const labs = [
  "01-code-detective",
  "02-bug-hunter",
  "03-safe-refactor",
  "04-agent-workflow",
  "final-mission",
];
const command = `pnpm exec vitest run ${labs.map((lab) => `labs/${lab}`).join(" ")}`;
const result = await import("node:child_process").then(({ execSync }) => {
  try {
    execSync(command, { stdio: "inherit" });
    return 0;
  } catch (error) {
    return error.status ?? 1;
  }
});
process.exitCode = result;

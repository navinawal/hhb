import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://localhost:3010",
    launchOptions: {
      executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    },
  },
});

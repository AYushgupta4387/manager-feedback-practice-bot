import "dotenv/config";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateEmployeeReply } from "./ai/generateEmployeeReply.js";

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const employeeRecordPath = path.join(serverDirectory, "..", "src", "data", "employee_record.json");
const employeeRecord = JSON.parse(await readFile(employeeRecordPath, "utf8"));
const port = Number(process.env.PORT || 8787);

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body));
}

async function readJsonBody(request) {
  let body = "";

  for await (const chunk of request) {
    body += chunk;

    if (body.length > 100_000) {
      throw new Error("Request body is too large.");
    }
  }

  return JSON.parse(body || "{}");
}

function isValidTranscript(transcript) {
  return (
    Array.isArray(transcript) &&
    transcript.length > 0 &&
    transcript.every(
      (turn) =>
        turn &&
        (turn.speaker === "manager" || turn.speaker === "employee") &&
        typeof turn.text === "string" &&
        turn.text.trim().length > 0,
    )
  );
}

const server = createServer(async (request, response) => {
  if (request.method !== "POST" || request.url !== "/api/rehearse/reply") {
    sendJson(response, 404, { error: "Route not found." });
    return;
  }

  try {
    const { transcript } = await readJsonBody(request);

    if (!isValidTranscript(transcript)) {
      sendJson(response, 400, { error: "A valid conversation transcript is required." });
      return;
    }

    const reply = await generateEmployeeReply({ employeeRecord, transcript });
    sendJson(response, 200, { reply });
  } catch (error) {
    console.error("Unable to generate an employee reply.", error);
    sendJson(response, 500, {
      error: "Rohit could not generate a reply. Please try again.",
    });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Feedback coach server listening on http://127.0.0.1:${port}`);
});

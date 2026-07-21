const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;

function loadLocalEnv() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  });
}

loadLocalEnv();

const port = Number(process.env.PORT || 8000);
const scholarshipRecipient = "scholarships@cltimmons.org";
const defaultFromEmail = "The Cathy Lance Timmons Foundation <noreply@cltimmons.org>";
const resendTimeoutMs = 15000;
const recipients = {
  administration: "admin@cltimmons.org",
  partnerships: "partnerships@cltimmons.org",
  scholarships: scholarshipRecipient,
  socials: "socials@cltimmons.org",
  technology: "technology@cltimmons.org"
};
const officerRecipients = {
  founder: { email: "tlance@cltimmons.org", name: "Tatyana Lance" },
  "strategic-marketing": { email: "ellance@cltimmons.org", name: "Elizabeth Lance" },
  secretary: { email: "elance@cltimmons.org", name: "Eric Lance" },
  "community-affairs": { email: "omerchant@cltimmons.org", name: "Oscar Merchant III" },
  "cfo-keasia": { email: "klance@cltimmons.org", name: "Keasia Lance" },
  technology: { email: "alance@cltimmons.org", name: "Alexander Lance" },
  "education-affairs": { email: "mwilliamson@cltimmons.org", name: "Michiko Williamson" },
  parish: { email: "pbrown@cltimmons.org", name: "Parish Brown" },
  brenda: { email: "bperkins@cltimmons.org", name: "Brenda Perkins" },
  health: { email: "admin@cltimmons.org", name: "Shearia Burch-McElveen" },
  education: { email: "admin@cltimmons.org", name: "Dr. Bridget Fleming" },
  wellness: { email: "admin@cltimmons.org", name: "Dr. Kira O'Neal" },
  governance: { email: "admin@cltimmons.org", name: "The Honorable Adonikam J. Hudson" },
  "legacy-members": { email: "admin@cltimmons.org", name: "Legacy Members" }
};

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body is too large"));
      }
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sanitize(value) {
  return String(value || "").replace(/\u0000/g, "").trim();
}

function normalizePayload(body) {
  const payload = {};

  Object.entries(body || {}).forEach(([key, value]) => {
    payload[key] = sanitize(value);
  });

  return payload;
}

async function parseResendError(resendResponse) {
  const contentType = resendResponse.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await resendResponse.json().catch(() => null);
    return data?.message || data?.error || JSON.stringify(data);
  }

  return resendResponse.text().catch(() => "Unknown Resend error");
}

async function sendEmail({ to, replyTo, subject, text }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Email provider is not configured.");
  }

  const fromEmail = process.env.CONTACT_FROM_EMAIL || defaultFromEmail;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), resendTimeoutMs);
  let resendResponse;
  try {
    resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        reply_to: replyTo,
        subject,
        text
      })
    });
  } catch (error) {
    throw new Error("Email provider request timed out or could not be reached.");
  } finally {
    clearTimeout(timeout);
  }

  if (!resendResponse.ok) {
    const resendError = await parseResendError(resendResponse);
    throw new Error(`Email provider rejected the message: ${resendError}`);
  }

  return { sent: true };
}

function formatScholarshipApplication(application) {
  const fullName = [application.firstName, application.middleName, application.lastName].filter(Boolean).join(" ");

  return [
    "Scholarship Application",
    "",
    `Submitted: ${application.submittedAt}`,
    `Scholarship: ${application.scholarshipProgram}`,
    `Application term: ${application.applicationTerm}`,
    "",
    "Applicant",
    `Name: ${fullName}`,
    `Date of birth: ${application.dateOfBirth}`,
    `Email: ${application.email}`,
    `Phone: ${application.phone}`,
    `Address: ${application.address}, ${application.city}, ${application.state} ${application.zip}`,
    `County: ${application.county || "Not provided"}`,
    "",
    "Academic Information",
    `Current school: ${application.currentSchool}`,
    `School type: ${application.schoolType}`,
    `Expected graduation: ${application.graduationDate}`,
    `GPA: ${application.gpa}`,
    `Student ID: ${application.studentId || "Not provided"}`,
    `Planned institution: ${application.plannedInstitution}`,
    `Major or field: ${application.major}`,
    `Degree or credential: ${application.degree}`,
    `Enrollment status: ${application.enrollmentStatus}`,
    "",
    "Service, Leadership, and Need",
    `Activities: ${application.activities}`,
    `Honors: ${application.honors || "Not provided"}`,
    `Financial need: ${application.financialNeed}`,
    "",
    "Foundation Values Paragraph",
    application.valuesParagraph,
    "",
    "Reference",
    `Name: ${application.referenceName}`,
    `Relationship: ${application.referenceRelationship}`,
    `Email: ${application.referenceEmail}`,
    `Phone: ${application.referencePhone || "Not provided"}`,
    "",
    "Documents",
    `Parchment acknowledgement: ${application.parchmentAcknowledgement}`,
    `Document notes: ${application.documentNotes || "Not provided"}`,
    "",
    "Certification",
    `Accuracy certification: ${application.accuracyCertification}`,
    `Communication consent: ${application.communicationConsent}`
  ].join("\n");
}

function validateScholarshipApplication(application) {
  const requiredFields = [
    "scholarshipProgram",
    "applicationTerm",
    "firstName",
    "lastName",
    "dateOfBirth",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "zip",
    "currentSchool",
    "schoolType",
    "graduationDate",
    "gpa",
    "plannedInstitution",
    "major",
    "degree",
    "enrollmentStatus",
    "activities",
    "financialNeed",
    "valuesParagraph",
    "referenceName",
    "referenceRelationship",
    "referenceEmail",
    "parchmentAcknowledgement",
    "accuracyCertification",
    "communicationConsent"
  ];
  const missingFields = requiredFields.filter((field) => !application[field]);

  if (missingFields.length > 0) {
    return { valid: false, status: 400, payload: { error: "Required fields are missing.", missingFields } };
  }

  if (application.valuesParagraph.length < 250) {
    return { valid: false, status: 400, payload: { error: "The personal paragraph must be at least 250 characters." } };
  }

  return { valid: true };
}

async function handleContact(req, res) {
  const body = normalizePayload(await readRequestBody(req));
  const officerRecipient = officerRecipients[body.recipient];
  const recipient = officerRecipient?.email || recipients[body.topic] || recipients.administration;

  if (!body.name || !body.email || !body.message) {
    sendJson(res, 400, { error: "Name, email, and message are required." });
    return;
  }

  const topicLabel = officerRecipient ? `inquiry for ${officerRecipient.name}` : `${body.topic || "general"} inquiry`;
  await sendEmail({
    to: recipient,
    replyTo: body.email,
    subject: `Website ${topicLabel} from ${body.name}`,
    text: [
      `Name: ${body.name}`,
      `Email: ${body.email}`,
      officerRecipient ? `Recipient: ${officerRecipient.name} <${officerRecipient.email}>` : `Topic: ${body.topic || "general"}`,
      "",
      "Message:",
      body.message
    ].join("\n")
  });

  sendJson(res, 200, { ok: true, recipient });
}

async function handleScholarship(req, res) {
  const application = normalizePayload(await readRequestBody(req));
  application.submittedAt = new Date().toISOString();

  const validation = validateScholarshipApplication(application);
  if (!validation.valid) {
    sendJson(res, validation.status, validation.payload);
    return;
  }

  const dataDir = path.join(root, "data");
  const applicationPath = path.join(dataDir, "scholarship-applications.jsonl");
  fs.mkdirSync(dataDir, { recursive: true });
  fs.appendFileSync(applicationPath, `${JSON.stringify(application)}\n`, "utf8");

  const fullName = [application.firstName, application.lastName].filter(Boolean).join(" ");
  await sendEmail({
    to: scholarshipRecipient,
    replyTo: application.email,
    subject: `Scholarship application from ${fullName}`,
    text: formatScholarshipApplication(application)
  });

  sendJson(res, 200, { ok: true, recipient: scholarshipRecipient });
}

http
  .createServer(async (req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);

    if (req.method === "POST" && urlPath === "/api/contact") {
      try {
        await handleContact(req, res);
      } catch (error) {
        sendJson(res, 502, { error: error.message || "Unable to send message." });
      }
      return;
    }

    if (req.method === "POST" && urlPath === "/api/scholarship") {
      try {
        await handleScholarship(req, res);
      } catch (error) {
        sendJson(res, 502, { error: error.message || "Unable to submit application." });
      }
      return;
    }

    const relativePath = urlPath === "/" ? "index.html" : urlPath.replace(/^[/\\]+/, "");
    const safePath = path.normalize(relativePath).replace(/^(\.\.[/\\])+/, "");
    const filePath = path.join(root, safePath);

    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
      }

      res.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Serving http://127.0.0.1:${port}`);
  });

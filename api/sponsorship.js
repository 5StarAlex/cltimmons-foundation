const sponsorshipRecipient = "partnerships@cltimmons.org";
const defaultFromEmail = "The Cathy Lance Timmons Foundation <noreply@cltimmons.org>";
const resendTimeoutMs = 15000;

const requiredFields = [
  "organizationName",
  "contactName",
  "email",
  "phone",
  "preferredFollowUp",
  "sponsorshipLevel",
  "sponsorshipAmount",
  "paymentMethod",
  "sponsorshipNotes",
  "packetAcknowledgement",
  "communicationConsent"
];

function sanitize(value) {
  return String(value || "").replace(/\u0000/g, "").trim();
}

async function parseResendError(resendResponse) {
  const contentType = resendResponse.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await resendResponse.json().catch(() => null);
    return data?.message || data?.error || JSON.stringify(data);
  }

  return resendResponse.text().catch(() => "Unknown Resend error");
}

function normalizeSubmission(body) {
  const submission = {};

  Object.entries(body || {}).forEach(([key, value]) => {
    submission[key] = sanitize(value);
  });

  return submission;
}

function yesNo(value) {
  return value ? "Yes" : "No";
}

function buildSubmissionText(submission) {
  const supportAreas = [
    submission.supportScholarships ? "Scholarships and educational support" : "",
    submission.supportCathysCloset ? "Cathy's Closet and resource drives" : "",
    submission.supportCommunityOutreach ? "Community outreach and special events" : "",
    submission.supportWellBeing ? "Well-being and mental health initiatives" : ""
  ].filter(Boolean);

  return [
    "Sponsorship Submission",
    "",
    `Submitted: ${submission.submittedAt}`,
    "",
    "Organization",
    `Organization or sponsor name: ${submission.organizationName}`,
    `Recognition name: ${submission.recognitionName || "Not provided"}`,
    `Contact name: ${submission.contactName}`,
    `Title or role: ${submission.contactTitle || "Not provided"}`,
    `Email: ${submission.email}`,
    `Phone: ${submission.phone}`,
    `Website: ${submission.website || "Not provided"}`,
    `Address: ${[submission.address, submission.city, submission.state, submission.zip].filter(Boolean).join(", ") || "Not provided"}`,
    `Preferred follow-up: ${submission.preferredFollowUp}`,
    "",
    "Sponsorship Details",
    `Sponsorship level: ${submission.sponsorshipLevel}`,
    `Sponsorship amount: $${submission.sponsorshipAmount}`,
    `Payment method: ${submission.paymentMethod}`,
    `Logo or recognition material status: ${submission.logoStatus || "Not provided"}`,
    `Support areas: ${supportAreas.join("; ") || "Not selected"}`,
    "",
    "Notes",
    submission.sponsorshipNotes,
    "",
    "Certification",
    `Packet acknowledgement: ${yesNo(submission.packetAcknowledgement)}`,
    `Communication consent: ${yesNo(submission.communicationConsent)}`
  ].join("\n");
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const submission = normalizeSubmission(request.body);
  submission.submittedAt = new Date().toISOString();

  const missingFields = requiredFields.filter((field) => !submission[field]);
  if (missingFields.length > 0) {
    response.status(400).json({ error: "Required fields are missing.", missingFields });
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    response.status(503).json({ error: "Email provider is not configured." });
    return;
  }

  const fromEmail = process.env.CONTACT_FROM_EMAIL || defaultFromEmail;
  const subject = `Sponsorship submission from ${submission.organizationName}`;

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
        to: [sponsorshipRecipient],
        reply_to: submission.email,
        subject,
        text: buildSubmissionText(submission)
      })
    });
  } catch (error) {
    response.status(504).json({ error: "Email provider request timed out or could not be reached." });
    return;
  } finally {
    clearTimeout(timeout);
  }

  if (!resendResponse.ok) {
    const resendError = await parseResendError(resendResponse);
    response.status(502).json({ error: "Email provider rejected the sponsorship submission.", details: resendError });
    return;
  }

  response.status(200).json({ ok: true, recipient: sponsorshipRecipient });
}

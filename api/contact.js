const recipients = {
  administration: "admin@cltimmons.org",
  partnerships: "partnerships@cltimmons.org",
  scholarships: "scholarships@cltimmons.org",
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
  governance: { email: "admin@cltimmons.org", name: "The Honorable Adonikam J. Hudson" }
};

const defaultFromEmail = "The Cathy Lance Timmons Foundation <noreply@cltimmons.org>";
const resendTimeoutMs = 15000;

function sanitize(value) {
  return String(value || "").replace(/[\r\n]+/g, " ").trim();
}

async function parseResendError(resendResponse) {
  const contentType = resendResponse.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await resendResponse.json().catch(() => null);
    return data?.message || data?.error || JSON.stringify(data);
  }

  return resendResponse.text().catch(() => "Unknown Resend error");
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const name = sanitize(request.body?.name);
  const email = sanitize(request.body?.email);
  const topic = sanitize(request.body?.topic);
  const recipientKey = sanitize(request.body?.recipient);
  const message = String(request.body?.message || "").trim();
  const officerRecipient = officerRecipients[recipientKey];
  const recipient = officerRecipient?.email || recipients[topic] || recipients.administration;

  if (!name || !email || !message) {
    response.status(400).json({ error: "Name, email, and message are required." });
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    response.status(503).json({ error: "Email provider is not configured." });
    return;
  }

  const fromEmail = process.env.CONTACT_FROM_EMAIL || defaultFromEmail;
  const topicLabel = officerRecipient ? `inquiry for ${officerRecipient.name}` : `${topic || "general"} inquiry`;
  const subject = `Website ${topicLabel} from ${name}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    officerRecipient ? `Recipient: ${officerRecipient.name} <${officerRecipient.email}>` : `Topic: ${topic || "general"}`,
    "",
    "Message:",
    message
  ].join("\n");

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
        to: [recipient],
        reply_to: email,
        subject,
        text
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
    response.status(502).json({ error: "Email provider rejected the message.", details: resendError });
    return;
  }

  response.status(200).json({ ok: true, recipient });
}

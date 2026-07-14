const recipients = {
  administration: "admin@cltimmons.org",
  partnerships: "partnerships@cltimmons.org",
  scholarships: "scholarships@cltimmons.org",
  socials: "socials@cltimmons.org",
  technology: "technology@cltimmons.org"
};

function sanitize(value) {
  return String(value || "").replace(/[\r\n]+/g, " ").trim();
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
  const message = String(request.body?.message || "").trim();
  const recipient = recipients[topic] || recipients.administration;

  if (!name || !email || !message) {
    response.status(400).json({ error: "Name, email, and message are required." });
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    response.status(503).json({ error: "Email provider is not configured." });
    return;
  }

  const fromEmail = process.env.CONTACT_FROM_EMAIL || "The Cathy Lance Timmons Foundation <onboarding@resend.dev>";
  const subject = `Website ${topic || "general"} inquiry from ${name}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Topic: ${topic || "general"}`,
    "",
    "Message:",
    message
  ].join("\n");

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [recipient],
      reply_to: email,
      subject,
      text
    })
  });

  if (!resendResponse.ok) {
    response.status(502).json({ error: "Email provider rejected the message." });
    return;
  }

  response.status(200).json({ ok: true, recipient });
}

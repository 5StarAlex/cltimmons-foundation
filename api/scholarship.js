const scholarshipRecipient = "scholarships@cltimmons.org";

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

function sanitize(value) {
  return String(value || "").replace(/\u0000/g, "").trim();
}

function normalizeApplication(body) {
  const application = {};

  Object.entries(body || {}).forEach(([key, value]) => {
    application[key] = sanitize(value);
  });

  return application;
}

function buildApplicationText(application) {
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

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const application = normalizeApplication(request.body);
  application.submittedAt = new Date().toISOString();

  const missingFields = requiredFields.filter((field) => !application[field]);
  if (missingFields.length > 0) {
    response.status(400).json({ error: "Required fields are missing.", missingFields });
    return;
  }

  if (application.valuesParagraph.length < 250) {
    response.status(400).json({ error: "The personal paragraph must be at least 250 characters." });
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    response.status(503).json({ error: "Email provider is not configured." });
    return;
  }

  const fullName = [application.firstName, application.lastName].filter(Boolean).join(" ");
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "The Cathy Lance Timmons Foundation <onboarding@resend.dev>";
  const subject = `Scholarship application from ${fullName}`;

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [scholarshipRecipient],
      reply_to: application.email,
      subject,
      text: buildApplicationText(application)
    })
  });

  if (!resendResponse.ok) {
    response.status(502).json({ error: "Email provider rejected the application." });
    return;
  }

  response.status(200).json({ ok: true, recipient: scholarshipRecipient });
}

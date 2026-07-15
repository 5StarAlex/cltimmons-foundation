const menuToggle = document.querySelector(".menu-toggle");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function handleImageFailure(image) {
  const candidates = image.dataset.sources ? image.dataset.sources.split("|") : [];
  const currentIndex = Number(image.dataset.sourceIndex || "0");

  if (currentIndex < candidates.length) {
    image.dataset.sourceIndex = String(currentIndex + 1);
    image.src = candidates[currentIndex];
    return;
  }

  const fallbackId = image.dataset.fallback;
  image.hidden = true;
  if (fallbackId) {
    document.querySelectorAll(`[data-fallback-target="${fallbackId}"]`).forEach((fallback) => {
      fallback.style.display = fallback.dataset.display || "block";
    });
  }
}

const managedImages = document.querySelectorAll("img[data-fallback]");

function checkLoadedImages() {
  managedImages.forEach((image) => {
    if (!image.hidden && image.complete && image.naturalWidth === 0) {
      handleImageFailure(image);
    }
  });
}

managedImages.forEach((image) => {
  const candidates = image.dataset.sources ? image.dataset.sources.split("|") : [];

  image.addEventListener("error", () => {
    handleImageFailure(image);
  });

  if (image.complete && image.naturalWidth === 0) {
    handleImageFailure(image);
  }
});

window.addEventListener("load", () => {
  checkLoadedImages();
  window.setTimeout(checkLoadedImages, 150);
  window.setTimeout(checkLoadedImages, 600);
});

document.querySelectorAll(".site-nav a").forEach((link) => {
  const linkPath = new URL(link.href, window.location.href).pathname.replace(/\/$/, "");
  const currentPath = window.location.pathname.replace(/\/$/, "") || "/index.html";
  const normalizedCurrent = currentPath === "" || currentPath === "/" ? "/index.html" : currentPath;
  if (linkPath.endsWith(normalizedCurrent.split("/").pop())) {
    link.classList.add("active");
  }
});

const officerProfiles = {
  founder: {
    role: "Founder & Board Director",
    name: "Tatyana Lance",
    photo: "assets/Taty.jpeg",
    alt: "Tatyana Lance",
    email: "mailto:tlance@cltimmons.org?subject=Website%20inquiry%20for%20Tatyana%20Lance",
    bio: "Daughter of Cathy Lance-Timmons, Tatyana founded The Cathy Lance Timmons Foundation to give back to the community her mother loved and advocated for so deeply. With graduate training in social work and business, she leads with a commitment to keeping Cathy's legacy alive through education, community impact, and meaningful service.",
    fullBio: "Daughter of Cathy Lance-Timmons, Tatyana holds a Master of Social Work (MSW) and a Master of Business Administration (MBA), and is a Licensed Master Social Worker (LMSW) and Licensed Clinical Social Worker Associate (LCSWA). She founded The Cathy Lance Timmons Foundation as a way to give back to the community her mother advocated for and loved so deeply, keeping her legacy alive and continuing to encourage others in positive, meaningful ways.\n\nCathy meant the world to her, and her love and passion for others lives on through this work. Her hope is that the foundation will reach communities everywhere, offering support through its community impact and education initiatives."
  },
  "strategic-marketing": {
    role: "Chair of Strategic Marketing",
    name: "Elizabeth Lance",
    photo: "assets/liz.jpeg",
    alt: "Elizabeth Lance",
    email: "mailto:ellance@cltimmons.org?subject=Website%20inquiry%20for%20Elizabeth%20Lance",
    bio: "Elizabeth Lance is a community engagement and marketing professional who helps build meaningful partnerships, strengthen outreach, and expand the Foundation's reach. As Chair of Strategic Marketing, she brings experience in strategic communications, relationship building, and community-centered storytelling.",
    fullBio: "Elizabeth Lance is a community engagement and marketing professional with a passion for building meaningful partnerships that strengthen organizations and create lasting impact. As Chair of Strategic Marketing, she brings expertise in strategic communications, relationship building, and community outreach to help expand the Foundation's reach and further its mission.\n\nElizabeth currently serves as Community Marketing Manager for Rycor Heating & Cooling, where she develops and manages community partnerships, leads marketing initiatives, and represents the company throughout the Carolinas. Her work focuses on connecting businesses, nonprofits, schools, and community organizations to create lasting value for the communities they serve.\n\nShe earned a Bachelor of Science in Child Development and Family Studies from North Carolina A&T State University. Her educational background and professional experience have instilled a deep appreciation for the transformative power of education and community support. She is passionate about advancing opportunities that encourage lifelong learning, strengthen families, and empower individuals to reach their fullest potential.\n\nElizabeth is honored to serve on the Board of Directors as Chair of Strategic Marketing for the Cathy Lance Timmons Foundation. She is proud to carry forward the legacy of her late Cousin Cathy, rooted in compassion, service, and an unwavering belief in the power of education to change lives. Through strategic storytelling, community partnerships, and meaningful outreach, Elizabeth is committed to ensuring Cousin Cathy's legacy continues to inspire others, expand access to continuing education, and create opportunities that positively impact future generations."
  },
  "cfo-eric": {
    role: "Chief Financial Officer",
    name: "Eric J. Lance",
    photo: "assets/eric.jpg",
    alt: "Eric J. Lance",
    email: "mailto:elance@cltimmons.org?subject=Website%20inquiry%20for%20Eric%20Lance",
    bio: "Eric J. Lance is a healthcare executive, educator, and community leader dedicated to service through leadership, education, and community engagement. As Chief Financial Officer, he supports the Foundation's commitment to responsible growth, educational excellence, and lasting community impact.",
    fullBio: "Eric J. Lance is a healthcare executive, educator, and community leader dedicated to serving others through leadership, education, and community engagement. He earned a Bachelor of Science in Health Education and Services from SC State University and a Master of Healthcare Administration from Webster University. He currently serves as a Director of Business Development for MUSC Health in the Pee Dee Division.\n\nIn addition to his healthcare leadership, Eric serves as an adjunct instructor and is actively involved in civic and alumni organizations, where he works to promote educational opportunities and strengthen communities.\n\nAs a member of the Foundation Board, he is honored to carry forward the legacy of service, leadership, and educational excellence established by the Foundation's namesake, believing that education and service are powerful tools for creating lasting change."
  },
  "community-affairs": {
    role: "Chief of Community Affairs",
    name: "Oscar Merchant III",
    photo: "assets/oscar.jpeg",
    alt: "Oscar Merchant III",
    email: "mailto:omerchant@cltimmons.org?subject=Website%20inquiry%20for%20Oscar%20Merchant",
    bio: "Oscar Merchant III is a dedicated public servant with more than 14 years of law enforcement experience and a deep commitment to community engagement. As Chief of Community Affairs, he brings servant leadership, mentorship, and relationship-building experience to the Foundation's outreach work.",
    fullBio: "Oscar Merchant III is a dedicated public servant with more than 14 years of experience in law enforcement, proudly serving the City of Florence Police Department. Throughout his career, he has worked in patrol, community engagement, code enforcement, and specialized enforcement units while building strong relationships with residents, businesses, and community organizations.\n\nOscar is passionate about servant leadership and believes in leading through integrity, accountability, and service to others. He has served as a mentor to youth, helped lead numerous community outreach initiatives, and has been recognized as Officer of the Year twice and Officer of the Quarter. He is also a certified drone pilot and bicycle officer, continually seeking opportunities to grow professionally and better serve the community.\n\nIn addition to his professional experience, Oscar is pursuing a bachelor's degree while focusing his studies on leadership and organizational development. His commitment to lifelong learning, collaboration, and community involvement has prepared him to contribute effectively in a board leadership role.\n\nOscar and his wife, Sharrie, are proud parents of two children and are committed to making Florence a safer, stronger, and more connected community."
  },
  "cfo-keasia": {
    role: "Chief Financial Officer",
    name: "Ke'Asia Lance, MBA",
    photo: "assets/keasia.JPEG",
    alt: "Ke'Asia Lance",
    email: "mailto:klance@cltimmons.org?subject=Website%20inquiry%20for%20Ke'Asia%20Lance",
    bio: "Ke'Asia Lance is a strategic business and healthcare operations leader with experience in financial oversight, project management, and organizational leadership. As Chief Financial Officer, she brings a strong background in budgeting, fiscal accountability, and operational excellence.",
    fullBio: "Ke'Asia Lance is a strategic business and healthcare operations leader with extensive experience in financial oversight, project management, and organizational leadership. As Chief Financial Officer, she brings a strong background in budgeting, fiscal accountability, and operational excellence.\n\nKe'Asia currently serves as a Project Leader at GE HealthCare, where she leads cross-functional initiatives, develops standardized processes, and drives operational improvements across the U.S. and Canada.\n\nHer financial leadership began at Winthrop University, where she served as the Allocation Administrator for the Student Allocation Committee. In this role, she oversaw an annual budget of more than $1 million, managing the equitable allocation of funding to over 100 student organizations. This experience strengthened her commitment to transparency, accountability, and responsible financial management.\n\nKe'Asia earned a Master of Business Administration with a focus in Project Management from the University of South Carolina and a Bachelor of Science in Health Care Management from Winthrop University. She is passionate about using strategic leadership and sound financial stewardship to strengthen organizations and create lasting community impact.\n\nKe'Asia is honored to serve on the Board of Directors as Chief Financial Officer for the Cathy Lance Timmons Foundation. Inspired by the life and legacy of her late aunt, Cathy Lance, she is committed to carrying forward the values Cathy instilled in her: the importance of lifelong learning, giving back to the community, and leading with a servant's heart. Ke'Asia looks forward to helping advance the Foundation's mission and ensuring that Cathy Lance's legacy continues to empower and inspire future generations."
  },
  technology: {
    role: "Director of Technology & Communications",
    name: "Alexander Lance",
    photo: "assets/alexander.jpeg",
    alt: "Alexander Lance",
    email: "mailto:alance@cltimmons.org?subject=Website%20inquiry%20for%20Alexander%20Lance",
    bio: "Alexander Lance is a Computer Science major and Applied Mathematics minor at Francis Marion University. As Director of Technology & Communications, he supports the Foundation's digital presence and helps use technology to create access, connection, and opportunity.",
    fullBio: "Alexander Lance is a Computer Science major and Applied Mathematics minor at Francis Marion University. As a Machine Learning Research Student and McNair Scholar, his work focuses on artificial intelligence, software engineering, and data-driven technologies, with experience in convolutional neural networks, IoT sensor systems, environmental monitoring, and full-stack web development. Through his academic pursuits and community service as a member of the Francis Marion University Honors Program, Alexander is committed to using technology to solve meaningful problems and create opportunities for others.\n\nAs a member of The Cathy Lance Timmons Foundation Board, Alexander is proud to help preserve the legacy of his grandmother, whose compassion, generosity, and belief in the power of education and service continue to inspire him. He is honored to support the Foundation's mission of empowering future generations through leadership, educational opportunities, and lasting community impact."
  },
  "education-affairs": {
    role: "Chief of Educational Affairs",
    name: "Michiko Williamson",
    photo: "assets/michiko.PNG",
    alt: "Michiko Williamson",
    email: "mailto:mwilliamson@cltimmons.org?subject=Website%20inquiry%20for%20Michiko%20Williamson",
    bio: "Michiko Williamson serves as Chief of Educational Affairs, helping guide the Foundation's education-centered work and its commitment to expanding access to continuing education opportunities. Her leadership supports the mission to encourage lifelong learning and honor Cathy's belief in the power of education.",
    fullBio: "Michiko Williamson serves as Chief of Educational Affairs for The Cathy Lance Timmons Foundation. In this role, she helps guide the Foundation's education-centered work and its commitment to expanding access to continuing education opportunities.\n\nHer leadership supports the mission to encourage lifelong learning, strengthen families, and honor Cathy's belief in the power of education to change lives."
  },
  "chief-advisor": {
    role: "Chief Advisor",
    name: "Parish Brown",
    noPhoto: true,
    email: "mailto:pbrown@cltimmons.org?subject=Website%20inquiry%20for%20Parish%20Brown",
    bio: "Biography coming soon."
  },
  "chief-advisor-brenda": {
    role: "Chief Advisor",
    name: "Brenda Perkins",
    noPhoto: true,
    email: "mailto:bperkins@cltimmons.org?subject=Website%20inquiry%20for%20Brenda%20Perkins",
    bio: "Biography coming soon."
  }
};

const officerTabs = document.querySelectorAll(".officer-tab");
const officerFeature = document.querySelector(".officer-feature");
const officerPhoto = document.getElementById("officerPhoto");
const officerRole = document.getElementById("officerRole");
const officerName = document.getElementById("officerName");
const officerBio = document.getElementById("officerBio");
const officerEmail = document.getElementById("officerEmail");
const officerReadMore = document.getElementById("officerReadMore");
const bioModal = document.getElementById("bioModal");
const bioModalClose = document.getElementById("bioModalClose");
const bioModalRole = document.getElementById("bioModalRole");
const bioModalTitle = document.getElementById("bioModalTitle");
const bioModalText = document.getElementById("bioModalText");

let activeOfficerProfile = officerProfiles.founder;

function renderOfficerProfile(profile) {
  if (!profile || !officerPhoto || !officerRole || !officerName || !officerBio || !officerEmail) return;

  activeOfficerProfile = profile;
  if (officerFeature) {
    officerFeature.classList.toggle("no-photo", Boolean(profile.noPhoto));
  }
  if (!profile.noPhoto) {
    officerPhoto.src = profile.photo;
    officerPhoto.alt = profile.alt;
  }
  officerRole.textContent = profile.role;
  officerName.textContent = profile.name;
  officerBio.textContent = profile.bio;
  officerEmail.href = profile.email;
  officerEmail.textContent = "Email";

  if (officerReadMore) {
    officerReadMore.hidden = !profile.fullBio;
  }
}

function openBioModal() {
  if (!activeOfficerProfile || !activeOfficerProfile.fullBio || !bioModal) return;

  bioModalRole.textContent = activeOfficerProfile.role;
  bioModalTitle.textContent = activeOfficerProfile.name;
  bioModalText.textContent = activeOfficerProfile.fullBio;
  bioModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  bioModalClose.focus();
}

function closeBioModal() {
  if (!bioModal) return;

  bioModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (officerReadMore && !officerReadMore.hidden) {
    officerReadMore.focus();
  }
}

officerTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const profile = officerProfiles[tab.dataset.officer];
    if (!profile) return;

    officerTabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-selected", String(selected));
    });

    renderOfficerProfile(profile);
  });
});

if (officerReadMore) {
  officerReadMore.addEventListener("click", openBioModal);
}

if (bioModalClose) {
  bioModalClose.addEventListener("click", closeBioModal);
}

if (bioModal) {
  bioModal.addEventListener("click", (event) => {
    if (event.target === bioModal) {
      closeBioModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && bioModal && bioModal.getAttribute("aria-hidden") === "false") {
    closeBioModal();
  }
});

renderOfficerProfile(activeOfficerProfile);

const contactForm = document.querySelector("[data-contact-form]");
const contactRecipients = {
  administration: "admin@cltimmons.org",
  partnerships: "partnerships@cltimmons.org",
  scholarships: "scholarships@cltimmons.org",
  socials: "socials@cltimmons.org",
  technology: "technology@cltimmons.org"
};

if (contactForm) {
  const contactStatus = contactForm.querySelector("[data-contact-status]");

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const topic = String(formData.get("topic") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const emailTo = contactRecipients[topic] || contactRecipients.administration;
    const topicLabel = topic ? topic.replace(/-/g, " ") : "general";
    const subject = `Website ${topicLabel} inquiry from ${name}`;
    const body = [`Name: ${name}`, `Email: ${email}`, "", "Message:", message].join("\n");

    const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (contactStatus) {
      contactStatus.textContent = "Sending your message...";
    }

    fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, topic, message })
    })
      .then((response) => {
        if (!response.ok) throw new Error("Contact API unavailable");
        return response.json();
      })
      .then(() => {
        contactForm.reset();
        if (contactStatus) {
          contactStatus.textContent = `Thank you. Your message was sent to ${emailTo}.`;
        }
      })
      .catch(() => {
        window.location.href = mailtoUrl;
        if (contactStatus) {
          contactStatus.textContent = `Your email app should open with this message addressed to ${emailTo}.`;
        }
      });
  });
}

const scholarshipForm = document.querySelector("[data-scholarship-form]");
const scholarshipDraftKey = "cltimmons-scholarship-application-draft";
const scholarshipEmail = "scholarships@cltimmons.org";

function getFormPayload(form) {
  const payload = {};
  const formData = new FormData(form);

  formData.forEach((value, key) => {
    payload[key] = String(value).trim();
  });

  form.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    payload[checkbox.name] = checkbox.checked ? checkbox.value || "Yes" : "";
  });

  return payload;
}

function formatScholarshipEmail(payload) {
  const fullName = [payload.firstName, payload.middleName, payload.lastName].filter(Boolean).join(" ");
  const lines = [
    "Scholarship Application",
    "",
    `Scholarship: ${payload.scholarshipProgram || ""}`,
    `Application term: ${payload.applicationTerm || ""}`,
    "",
    "Applicant",
    `Name: ${fullName}`,
    `Date of birth: ${payload.dateOfBirth || ""}`,
    `Email: ${payload.email || ""}`,
    `Phone: ${payload.phone || ""}`,
    `Address: ${payload.address || ""}, ${payload.city || ""}, ${payload.state || ""} ${payload.zip || ""}`,
    `County: ${payload.county || ""}`,
    "",
    "Academic Information",
    `Current school: ${payload.currentSchool || ""}`,
    `School type: ${payload.schoolType || ""}`,
    `Expected graduation: ${payload.graduationDate || ""}`,
    `GPA: ${payload.gpa || ""}`,
    `Student ID: ${payload.studentId || ""}`,
    `Planned institution: ${payload.plannedInstitution || ""}`,
    `Major or field: ${payload.major || ""}`,
    `Degree or credential: ${payload.degree || ""}`,
    `Enrollment status: ${payload.enrollmentStatus || ""}`,
    "",
    "Service, Leadership, and Need",
    `Activities: ${payload.activities || ""}`,
    `Honors: ${payload.honors || ""}`,
    `Financial need: ${payload.financialNeed || ""}`,
    "",
    "Foundation Values Paragraph",
    payload.valuesParagraph || "",
    "",
    "Reference",
    `Name: ${payload.referenceName || ""}`,
    `Relationship: ${payload.referenceRelationship || ""}`,
    `Email: ${payload.referenceEmail || ""}`,
    `Phone: ${payload.referencePhone || ""}`,
    "",
    "Documents",
    `Parchment acknowledgement: ${payload.parchmentAcknowledgement || ""}`,
    `Document notes: ${payload.documentNotes || ""}`,
    "",
    "Certification",
    `Accuracy certification: ${payload.accuracyCertification || ""}`,
    `Communication consent: ${payload.communicationConsent || ""}`
  ];

  return lines.join("\n");
}

if (scholarshipForm) {
  const scholarshipStatus = scholarshipForm.querySelector("[data-scholarship-status]");
  const clearDraftButton = scholarshipForm.querySelector("[data-clear-scholarship-draft]");
  const savedDraft = window.localStorage.getItem(scholarshipDraftKey);

  if (savedDraft) {
    try {
      const draft = JSON.parse(savedDraft);
      Object.entries(draft).forEach(([name, value]) => {
        const field = scholarshipForm.elements[name];
        if (!field) return;
        if (field.type === "checkbox") {
          field.checked = Boolean(value);
        } else {
          field.value = value;
        }
      });
    } catch {
      window.localStorage.removeItem(scholarshipDraftKey);
    }
  }

  scholarshipForm.addEventListener("input", () => {
    window.localStorage.setItem(scholarshipDraftKey, JSON.stringify(getFormPayload(scholarshipForm)));
    if (scholarshipStatus) {
      scholarshipStatus.textContent = "Draft saved on this device.";
    }
  });

  if (clearDraftButton) {
    clearDraftButton.addEventListener("click", () => {
      window.localStorage.removeItem(scholarshipDraftKey);
      scholarshipForm.reset();
      if (scholarshipStatus) {
        scholarshipStatus.textContent = "Draft cleared.";
      }
    });
  }

  scholarshipForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!scholarshipForm.reportValidity()) return;

    const payload = getFormPayload(scholarshipForm);
    const fullName = [payload.firstName, payload.lastName].filter(Boolean).join(" ");
    const subject = `Scholarship application from ${fullName}`;
    const body = formatScholarshipEmail(payload);
    const mailtoUrl = `mailto:${scholarshipEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (scholarshipStatus) {
      scholarshipStatus.textContent = "Submitting your application...";
    }

    fetch("/api/scholarship", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then((response) => {
        if (!response.ok) throw new Error("Scholarship API unavailable");
        return response.json();
      })
      .then(() => {
        window.localStorage.removeItem(scholarshipDraftKey);
        scholarshipForm.reset();
        if (scholarshipStatus) {
          scholarshipStatus.textContent = `Thank you. Your application was saved and sent to ${scholarshipEmail}. Remember to send official documents through Parchment.`;
        }
      })
      .catch(() => {
        window.location.href = mailtoUrl;
        if (scholarshipStatus) {
          scholarshipStatus.textContent = `Your email app should open with your application addressed to ${scholarshipEmail}. Your saved draft will remain on this device.`;
        }
      });
  });
}

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
    role: "Board Chair & President",
    name: "Tatyana Lance, MBA, MSW, LMSW, LCSW-A",
    photo: "assets/Taty.jpeg",
    alt: "Tatyana Lance",
    email: "tlance@cltimmons.org",
    contactUrl: "officer-contact.html?person=founder",
    bio: "Daughter of Cathy Lance-Timmons, Tatyana serves as Board Chair & President, guiding the Foundation with clinical social work experience, business training, and a deep commitment to Cathy's legacy of compassion, education, and service.",
    fullBio: "Daughter of Cathy Lance-Timmons, Tatyana holds a Master of Social Work (MSW) and a Master of Business Administration (MBA), and is a Licensed Master Social Worker (LMSW) and Licensed Clinical Social Worker Associate (LCSWA). She founded The Cathy Lance Timmons Foundation as a way to give back to the community her mother advocated for and loved so deeply, keeping her legacy alive and continuing to encourage others in positive, meaningful ways.\n\nCathy meant the world to her, and her love and passion for others lives on through this work. Her hope is that the foundation will reach communities everywhere, offering support through its community impact and education initiatives."
  },
  "cfo-keasia": {
    role: "Treasurer & Director of Finance",
    name: "Keasia Lance, MBA",
    photo: "assets/keasia.JPEG",
    alt: "Keasia Lance",
    email: "klance@cltimmons.org",
    contactUrl: "officer-contact.html?person=cfo-keasia",
    bio: "Keasia Lance serves as Treasurer & Director of Finance, bringing strategic business, healthcare operations, budgeting, project management, and organizational leadership experience to the Foundation's stewardship work.",
    fullBio: "Keasia Lance is a strategic business and healthcare operations leader with extensive experience in financial oversight, project management, and organizational leadership. As Treasurer & Director of Finance, she brings a strong background in budgeting, fiscal accountability, and operational excellence.\n\nKeasia currently serves as a Project Leader at GE HealthCare, where she leads cross-functional initiatives, develops standardized processes, and drives operational improvements across the U.S. and Canada.\n\nHer financial leadership began at Winthrop University, where she served as the Allocation Administrator for the Student Allocation Committee. In this role, she oversaw an annual budget of more than $1 million, managing the equitable allocation of funding to over 100 student organizations. This experience strengthened her commitment to transparency, accountability, and responsible financial management.\n\nKeasia earned a Master of Business Administration with a focus in Project Management from the University of South Carolina and a Bachelor of Science in Health Care Management from Winthrop University. She is passionate about using strategic leadership and sound financial stewardship to strengthen organizations and create lasting community impact.\n\nKeasia is honored to serve on the Board of Directors as Treasurer & Director of Finance for the Cathy Lance Timmons Foundation. Inspired by the life and legacy of her late aunt, Cathy Lance, she is committed to carrying forward the values Cathy instilled in her: the importance of lifelong learning, giving back to the community, and leading with a servant's heart."
  },
  "strategic-marketing": {
    role: "Director of Marketing, Communications & Strategic Partnerships",
    name: "Elizabeth Lance, B.S.",
    photo: "assets/liz.jpeg",
    alt: "Elizabeth Lance",
    email: "ellance@cltimmons.org",
    contactUrl: "officer-contact.html?person=strategic-marketing",
    bio: "Elizabeth Lance serves as Director of Marketing, Communications & Strategic Partnerships, helping build meaningful partnerships, strengthen outreach, and expand the Foundation's reach through community-centered storytelling.",
    fullBio: "Elizabeth Lance is a community engagement and marketing professional with a passion for building meaningful partnerships that strengthen organizations and create lasting impact. As Director of Marketing, Communications & Strategic Partnerships, she brings expertise in strategic communications, relationship building, and community outreach to help expand the Foundation's reach and further its mission.\n\nElizabeth currently serves as Community Marketing Manager for Rycor Heating & Cooling, where she develops and manages community partnerships, leads marketing initiatives, and represents the company throughout the Carolinas. Her work focuses on connecting businesses, nonprofits, schools, and community organizations to create lasting value for the communities they serve.\n\nShe earned a Bachelor of Science in Child Development and Family Studies from North Carolina A&T State University. Her educational background and professional experience have instilled a deep appreciation for the transformative power of education and community support. She is passionate about advancing opportunities that encourage lifelong learning, strengthen families, and empower individuals to reach their fullest potential.\n\nElizabeth is honored to serve on the Board of Directors as Director of Marketing, Communications & Strategic Partnerships for the Cathy Lance Timmons Foundation. She is proud to carry forward the legacy of her late Cousin Cathy, rooted in compassion, service, and an unwavering belief in the power of education to change lives."
  },
  secretary: {
    role: "Secretary & Director of Administration",
    name: "Eric Lance, MHA",
    photo: "assets/eric.jpg",
    alt: "Eric Lance",
    email: "elance@cltimmons.org",
    contactUrl: "officer-contact.html?person=secretary",
    bio: "Eric Lance serves as Secretary & Director of Administration, supporting governance, records, coordination, and responsible organizational operations for the Foundation.",
    fullBio: "Eric Lance is a healthcare executive, educator, and community leader dedicated to serving others through leadership, education, and community engagement. He earned a Bachelor of Science in Health Education and Services from SC State University and a Master of Healthcare Administration from Webster University. He currently serves as a Director of Business Development for MUSC Health in the Pee Dee Division.\n\nIn addition to his healthcare leadership, Eric serves as an adjunct instructor and is actively involved in civic and alumni organizations, where he works to promote educational opportunities and strengthen communities.\n\nAs Secretary & Director of Administration, he is honored to carry forward the legacy of service, leadership, and educational excellence established by the Foundation's namesake, believing that education and service are powerful tools for creating lasting change."
  },
  "community-affairs": {
    role: "Director of Community Impact",
    name: "Oscar Merchant III",
    photo: "assets/oscar.jpeg",
    alt: "Oscar Merchant III",
    email: "omerchant@cltimmons.org",
    contactUrl: "officer-contact.html?person=community-affairs",
    bio: "Oscar Merchant III serves as Director of Community Impact, bringing public service, servant leadership, mentorship, and relationship-building experience to the Foundation's outreach work.",
    fullBio: "Oscar Merchant III is a dedicated public servant with more than 14 years of experience in law enforcement, proudly serving the City of Florence Police Department. Throughout his career, he has worked in patrol, community engagement, code enforcement, and specialized enforcement units while building strong relationships with residents, businesses, and community organizations.\n\nOscar is passionate about servant leadership and believes in leading through integrity, accountability, and service to others. He has served as a mentor to youth, helped lead numerous community outreach initiatives, and has been recognized as Officer of the Year twice and Officer of the Quarter. He is also a certified drone pilot and bicycle officer, continually seeking opportunities to grow professionally and better serve the community.\n\nIn addition to his professional experience, Oscar is pursuing a bachelor's degree while focusing his studies on leadership and organizational development. His commitment to lifelong learning, collaboration, and community involvement has prepared him to contribute effectively in a board leadership role.\n\nOscar and his wife, Sharrie, are proud parents of two children and are committed to making Florence a safer, stronger, and more connected community."
  },
  technology: {
    role: "Director of Technology and Software Development",
    name: "Alexander Lance, Certified Student Researcher",
    photo: "assets/alexander.jpeg",
    alt: "Alexander Lance",
    email: "alance@cltimmons.org",
    contactUrl: "officer-contact.html?person=technology",
    bio: "Alexander Lance serves as Director of Technology and Software Development, supporting the Foundation's digital presence, technical systems, and software work that creates access, connection, and opportunity.",
    fullBio: "Alexander Lance is a Computer Science major and Applied Mathematics minor at Francis Marion University. As a Machine Learning Research Student, McNair Scholar, and Certified Student Researcher, his work focuses on artificial intelligence, software engineering, and data-driven technologies, with experience in convolutional neural networks, IoT sensor systems, environmental monitoring, and full-stack web development. Through his academic pursuits and community service as a member of the Francis Marion University Honors Program, Alexander is committed to using technology to solve meaningful problems and create opportunities for others.\n\nAs Director of Technology and Software Development, Alexander is proud to help preserve the legacy of his grandmother, whose compassion, generosity, and belief in the power of education and service continue to inspire him."
  },
  "education-affairs": {
    role: "Legacy Council Chair",
    name: "Michiko Williamson, MA",
    photo: "assets/michiko.PNG",
    alt: "Michiko Williamson",
    email: "mwilliamson@cltimmons.org",
    contactUrl: "officer-contact.html?person=education-affairs",
    bio: "Michiko Williamson serves as Legacy Council Chair, helping guide remembrance, family connection, and mission continuity as the Foundation carries Cathy Lance Timmons' legacy forward.",
    fullBio: "Michiko Williamson serves as Legacy Council Chair for The Cathy Lance Timmons Foundation. In this role, she helps guide remembrance, family connection, and mission continuity as the Foundation carries Cathy Lance Timmons' legacy forward.\n\nHer leadership supports the mission to encourage lifelong learning, strengthen families, and honor Cathy's belief in the power of education to change lives."
  },
  parish: {
    role: "Director-at-Large",
    name: "Parish Brown, B.A.",
    noPhoto: true,
    email: "pbrown@cltimmons.org",
    contactUrl: "officer-contact.html?person=parish",
    bio: "Biography coming soon."
  },
  brenda: {
    role: "Director-at-Large",
    name: "Brenda Dozier Perkins, CCHW",
    photo: "assets/brenda.png",
    alt: "Brenda Perkins",
    email: "bperkins@cltimmons.org",
    contactUrl: "officer-contact.html?person=brenda",
    bio: "Brenda Dozier Perkins is a Georgetown, South Carolina community leader, healthcare professional, and advocate with more than 28 years of healthcare experience. As Founder and CEO of Browns Ferry Community Outreach, she works to strengthen rural communities through wellness, service, and engagement.",
    fullBio: "Brenda Dozier Perkins is a resident of Georgetown, South Carolina, the daughter of Mary L. Dozier and the late Carl Dozier Sr. She is married to Mr. Andreau Perkins and is the mother of two sons, Quinton Scott and Arlington Scott. She is also a mother-in-law to Jasmins Scott and the proud grandmother of four precious grandchildren.\n\nBrenda has dedicated her life to becoming a community leader, healthcare professional, and community advocate by uplifting and empowering her community. A proud 1984 graduate of Choppee High School, she continued her education at Horry-Georgetown Technical College, where she earned a certification in Cardiac Care. She later expanded her commitment to community wellness by receiving her certification as a Community Health Worker from the University of South Carolina Upstate.\n\nWith more than 28 years of experience in healthcare, Brenda has devoted her career to improving the health and well-being of others. Her passion for service led her to establish Browns Ferry Community Outreach, a 501(c)(3) nonprofit organization founded in April 2017. As CEO and Founder, she works tirelessly to address the needs of the Browns Ferry community, a rural area of Georgetown County and surrounding areas, through outreach, support programs, and community engagement.\n\nHer leadership extends into numerous civic and community roles. She currently serves on the Board of Trustees for the Browns Ferry Community Water Company, and she is a member of The Center for Community Health Alliance Governance Council and Community Voice Advisory Board. In addition, she supports youth and education as the Regional Magnet Community Outreach Member for Browns Ferry Elementary School for Creative and Performing Arts.\n\nBrenda's commitment to service has earned her numerous awards and accolades recognizing the impact she has made within her community. Despite these honors, she remains grounded in faith and gratitude.\n\nA devoted member of St. Paul AME Church in the Browns Ferry Community of Georgetown, South Carolina, Brenda actively serves in several ministries. She is the Vice President of the Adult Choir, Secretary of the Trustee Board, and an active member of the Usher Board.\n\nAbove all, Brenda gives thanks to God for the opportunities she has been given to serve and for the many people who have supported and inspired her along the way. Her personal motto is: \"Love is what love does.\""
  },
  health: {
    role: "Director of Health & Clinical Partnerships",
    name: "Shearia Burch-McElveen",
    photo: "assets/Shearia.jpg",
    alt: "Shearia Burch-McElveen",
    email: "admin@cltimmons.org",
    contactUrl: "officer-contact.html?person=health",
    bio: "Shearia Burch-McElveen serves as Director of Health & Clinical Partnerships. A Florence, South Carolina resident, she brings a strong background in health science, nursing, women's health, and service-centered care.",
    fullBio: "Shearia Burch-McElveen serves as Director of Health & Clinical Partnerships for The Cathy Lance Timmons Foundation. She is married with children and currently resides in Florence, South Carolina.\n\nShearia is a graduate of Aynor High School. She earned her Bachelor of Science in Health Science from Herzing University and her Master of Nursing degree from Coker University.\n\nShe is currently employed with McLeod Health, where she has worked in Women's Health for the past 11 years. Service has been a lifelong passion for Shearia, and she brings that commitment to her work supporting health-centered partnerships, care, and community well-being."
  },
  education: {
    role: "Director of Educational Opportunity",
    name: "Dr. Bridget Fleming",
    noPhoto: true,
    email: "admin@cltimmons.org",
    contactUrl: "officer-contact.html?person=education",
    bio: "Biography coming soon."
  },
  wellness: {
    role: "Director of Behavioral Health & Wellness",
    name: "Dr. Kira O'Neal",
    noPhoto: true,
    email: "admin@cltimmons.org",
    contactUrl: "officer-contact.html?person=wellness",
    bio: "Biography coming soon."
  },
  governance: {
    role: "Director of Legal & Governance",
    name: "The Honorable Adonikam J. Hudson",
    photo: "assets/adonikam.JPG",
    alt: "The Honorable Adonikam J. Hudson",
    email: "admin@cltimmons.org",
    contactUrl: "officer-contact.html?person=governance",
    bio: "The Honorable Adonikam J. Hudson serves as Director of Legal & Governance. He is proprietor of The Hudson Law Firm LLC in Timmonsville and a Florence Magistrate Judge with experience across legal practice, education, and public service.",
    fullBio: "The Honorable Adonikam J. Hudson is the proprietor of The Hudson Law Firm LLC, located in Timmonsville, South Carolina. His practice includes criminal defense, family law, personal injury, and probate law. He began his legal career as a legal assistant at Nelson Mullins, where he conducted research and compiled data for significant legal matters.\n\nIn addition to his legal work, Mr. Hudson has a strong background in public service through AmeriCorps and Teach For America. During that time, he taught middle school mathematics and focused on empowering students from low socioeconomic backgrounds in Florence School District Three and Kershaw County School District. He later expanded his commitment to educational service by successfully running for and being elected to the Florence School District Four Board.\n\nMr. Hudson has also assisted juvenile defendants as co-counsel through the University of South Carolina Law Juvenile Justice Clinic. He gained additional experience as a summer associate at the South Carolina Commission on Indigent Defense, where he supported counsel in capital trials and helped construct legal defenses for clients. He also held a position at the Fifth Circuit Solicitor's Office under the mentorship of The Honorable Byron Gipson.\n\nPresently, Mr. Hudson serves as a Magistrate Judge in Florence, South Carolina, contributing to the community of his hometown, Timmonsville."
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
  officerEmail.href = profile.contactUrl;
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
  const isOfficerContactForm = contactForm.hasAttribute("data-officer-contact-form");
  const recipientField = contactForm.querySelector("[data-recipient-field]");
  const recipientDisplay = contactForm.querySelector("[data-recipient-display]");
  const topicField = contactForm.elements.topic;
  const contactHeroTitle = document.querySelector("[data-contact-hero-title]");
  const contactHeroText = document.querySelector("[data-contact-hero-text]");

  if (isOfficerContactForm) {
    const personKey = new URLSearchParams(window.location.search).get("person") || "founder";
    const normalizedPersonKey = Object.keys(officerProfiles).includes(personKey) ? personKey : "founder";
    const profile = officerProfiles[normalizedPersonKey] || officerProfiles.founder;

    if (recipientField) {
      recipientField.value = normalizedPersonKey;
    }
    if (recipientDisplay) {
      recipientDisplay.value = `${profile.name} (${profile.email})`;
    }
    if (contactHeroTitle) {
      contactHeroTitle.textContent = `Contact ${profile.name}.`;
    }
    if (contactHeroText) {
      contactHeroText.hidden = true;
    }
    if (contactStatus) {
      contactStatus.textContent = `Messages are sent directly through the website to ${profile.email}.`;
    }
  } else if (topicField) {
    const topicKey = new URLSearchParams(window.location.search).get("topic") || "";

    if (Object.prototype.hasOwnProperty.call(contactRecipients, topicKey)) {
      topicField.value = topicKey;
    }
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const topic = String(formData.get("topic") || "").trim();
    const recipient = String(formData.get("recipient") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const profile = officerProfiles[recipient];
    const emailTo = profile?.email || contactRecipients[topic] || contactRecipients.administration;
    if (contactStatus) {
      contactStatus.textContent = "Sending your message...";
    }

    fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, topic, recipient, message })
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().catch(() => ({})).then((data) => {
            throw new Error(data.details || data.error || "Contact API unavailable");
          });
        }
        return response.json();
      })
      .then(() => {
        contactForm.reset();
        if (isOfficerContactForm && recipientDisplay && recipientField) {
          const selectedProfile = officerProfiles[recipient] || officerProfiles.founder;
          recipientField.value = recipient || "founder";
          recipientDisplay.value = `${selectedProfile.name} (${selectedProfile.email})`;
        }
        if (contactStatus) {
          contactStatus.textContent = `Thank you. Your message was sent to ${emailTo}.`;
        }
      })
      .catch((error) => {
        if (contactStatus) {
          contactStatus.textContent = `Message was not sent. ${error.message}`;
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
        if (!response.ok) {
          return response.json().catch(() => ({})).then((data) => {
            throw new Error(data.details || data.error || "Scholarship API unavailable");
          });
        }
        return response.json();
      })
      .then(() => {
        window.localStorage.removeItem(scholarshipDraftKey);
        scholarshipForm.reset();
        if (scholarshipStatus) {
          scholarshipStatus.textContent = `Thank you. Your application was saved and sent to ${scholarshipEmail}. Remember to send official documents through Parchment.`;
        }
      })
      .catch((error) => {
        if (scholarshipStatus) {
          scholarshipStatus.textContent = `Application was not sent. ${error.message}`;
        }
      });
  });
}

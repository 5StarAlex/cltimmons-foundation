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
    email: "mailto:info@cltimmonsfoundation.org",
    bio: "Daughter of Cathy Lance-Timmons, Tatyana holds a Master of Social Work (MSW) and a Master of Business Administration (MBA), and is a Licensed Master Social Worker (LMSW) and Licensed Clinical Social Worker Associate (LCSWA). She founded The Cathy Lance Timmons Foundation as a way to give back to the community her mother advocated for and loved so deeply, keeping her legacy alive and continuing to encourage others in positive, meaningful ways. Her hope is that the foundation will reach communities everywhere, offering support through its community impact and education initiatives."
  },
  president: {
    role: "President / Chairperson",
    name: "President",
    photo: "assets/cathy and papa.jpeg",
    alt: "Foundation leadership",
    email: "mailto:info@cltimmonsfoundation.org",
    bio: "The President helps guide the foundation's mission, partnerships, and long-term direction. This officer works with the board to ensure each initiative reflects Cathy Lance Timmons' legacy of service, education, and community care."
  },
  "vice-president": {
    role: "Vice President",
    name: "Vice President",
    photo: "assets/cathy and papa.jpeg",
    alt: "Foundation leadership",
    email: "mailto:info@cltimmonsfoundation.org",
    bio: "The Vice President supports strategic planning, program development, and board coordination. This officer helps keep foundation work aligned, responsive, and grounded in meaningful community impact."
  },
  secretary: {
    role: "Secretary",
    name: "Secretary",
    photo: "assets/cathy and papa.jpeg",
    alt: "Foundation leadership",
    email: "mailto:info@cltimmonsfoundation.org",
    bio: "The Secretary maintains key records, supports communication, and helps preserve the foundation's organizational history. This role keeps board activity clear, accountable, and connected."
  },
  treasurer: {
    role: "Treasurer",
    name: "Treasurer",
    photo: "assets/cathy and papa.jpeg",
    alt: "Foundation leadership",
    email: "mailto:info@cltimmonsfoundation.org",
    bio: "The Treasurer helps steward financial resources with care and transparency. This officer supports responsible giving, scholarship funding, and sustainable program growth."
  },
  technology: {
    role: "Director of Technology",
    name: "Director of Technology",
    photo: "assets/cathy and papa.jpeg",
    alt: "Foundation leadership",
    email: "mailto:info@cltimmonsfoundation.org",
    bio: "The Director of Technology supports digital systems, communications, and online access to foundation resources. This role helps the mission reach families, students, partners, and supporters more effectively."
  },
  "board-member": {
    role: "Board Member",
    name: "Board Member",
    photo: "assets/cathy and papa.jpeg",
    alt: "Foundation leadership",
    email: "mailto:info@cltimmonsfoundation.org",
    bio: "Board members provide guidance, oversight, and community perspective. Their leadership helps the foundation make thoughtful decisions and expand its service with integrity."
  }
};

const officerTabs = document.querySelectorAll(".officer-tab");
const officerPhoto = document.getElementById("officerPhoto");
const officerRole = document.getElementById("officerRole");
const officerName = document.getElementById("officerName");
const officerBio = document.getElementById("officerBio");
const officerEmail = document.getElementById("officerEmail");

officerTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const profile = officerProfiles[tab.dataset.officer];
    if (!profile) return;

    officerTabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-selected", String(selected));
    });

    officerPhoto.src = profile.photo;
    officerPhoto.alt = profile.alt;
    officerRole.textContent = profile.role;
    officerName.textContent = profile.name;
    officerBio.textContent = profile.bio;
    officerEmail.href = profile.email;
  });
});

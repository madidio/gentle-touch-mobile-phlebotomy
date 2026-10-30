
import fs from "node:fs";
import path from "node:path";

const SITE_NAME = "Gentle Touch Mobile Blood Draw";
const SITE_URL = "https://omahagentletouchlabs.com";
const SOCIAL_IMAGE = `${SITE_URL}/images/Gentle-Touch-Logo.jpg`;

const HERO_IMAGE = "/images/phlebotomy-tubes-hero.webp";

const routes = [
  {
    path: "/",
    title: "Mobile Blood Draws Omaha, NE",
    description:
      "Convenient mobile blood draws at your home or office in Omaha, Douglas County and Sarpy County. Explore services, pricing and scheduling with Gentle Touch.",
  },
  {
    path: "/about",
    title: "About Our Mobile Phlebotomy Service in Omaha",
    description:
      "Learn about Gentle Touch Mobile Blood Draw and our compassionate, professional mobile phlebotomy services serving Omaha and surrounding communities.",
  },
  {
    path: "/services",
    title: "Mobile Blood Draw Services & Pricing in Omaha",
    description:
      "Explore mobile blood draw services and pricing from Gentle Touch Mobile Blood Draw, serving patients throughout the Omaha Metro.",
  },
  {
    path: "/providers",
    title: "Mobile Phlebotomy for Healthcare Providers in Omaha",
    description:
      "Gentle Touch Mobile Blood Draw partners with healthcare providers in Omaha to provide professional mobile phlebotomy services for their patients.",
  },
  {
    path: "/contact",
    title: "Contact & Book a Mobile Blood Draw in Omaha",
    description:
      "Contact Gentle Touch Mobile Blood Draw to schedule professional mobile phlebotomy services in Omaha, Douglas County, Sarpy County, and surrounding communities.",
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy",
    description:
      "Learn how Gentle Touch Mobile Blood Draw, LLC collects, uses, shares, and protects personal information submitted through our website.",
  },
  {
    path: "/terms-of-service",
    title: "Terms of Service",
    description:
      "Review appointment scheduling, payment requirements, cancellation and refund policies, and mobile phlebotomy service terms for Gentle Touch Mobile Blood Draw, LLC.",
  },
];

const distDir = path.resolve("dist");
const sourcePath = path.join(distDir, "index.html");

if (!fs.existsSync(sourcePath)) {
  throw new Error(
    "dist/index.html was not found. Run the Vite build before this script."
  );
}

const baseHtml = fs.readFileSync(sourcePath, "utf8");

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function removeExistingSeo(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta[^>]+name=["']description["'][^>]*>/gi, "")
    .replace(/<meta[^>]+name=["']robots["'][^>]*>/gi, "")
    .replace(/<meta[^>]+property=["']og:[^"']+["'][^>]*>/gi, "")
    .replace(/<meta[^>]+name=["']twitter:[^"']+["'][^>]*>/gi, "")
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, "");
}

function removeHomepageImagePreload(html) {
  // Keep the homepage hero image preload only on the homepage.
  // Remove it from all other pages, including Terms of Service.

  return html
    .replace(
      /<!--\s*Preload homepage hero image for faster LCP\s*-->\s*/gi,
      ""
    )
    .replace(
      /<link\b(?=[^>]*\brel=["']preload["'])(?=[^>]*\bas=["']image["'])(?=[^>]*\bhref=["']\/images\/phlebotomy-tubes-hero\.webp["'])[^>]*\/?>/gi,
      ""
    );
}

for (const route of routes) {
  const canonical =
    route.path === "/"
      ? `${SITE_URL}/`
      : `${SITE_URL}${route.path}`;

  const fullTitle = `${route.title} | ${SITE_NAME}`;

  const seo = `
    <title>${escapeHtml(fullTitle)}</title>

    <meta
      name="description"
      content="${escapeHtml(route.description)}"
    />

    <meta name="robots" content="index, follow" />

    <link rel="canonical" href="${canonical}" />

    <meta
      property="og:title"
      content="${escapeHtml(fullTitle)}"
    />

    <meta
      property="og:description"
      content="${escapeHtml(route.description)}"
    />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SOCIAL_IMAGE}" />
    <meta property="og:image:alt" content="${SITE_NAME}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="en_US" />

    <meta name="twitter:card" content="summary_large_image" />

    <meta
      name="twitter:title"
      content="${escapeHtml(fullTitle)}"
    />

    <meta
      name="twitter:description"
      content="${escapeHtml(route.description)}"
    />

    <meta name="twitter:image" content="${SOCIAL_IMAGE}" />
  `;

  let html = removeExistingSeo(baseHtml);

  // Only the homepage should preload its hero image.
  if (route.path !== "/") {
    html = removeHomepageImagePreload(html);
  }

  // Insert route-specific SEO tags.
  html = html.replace("</head>", `${seo}\n</head>`);

  // Generate the correct HTML file for each route.
  const outputPath =
    route.path === "/"
      ? path.join(distDir, "index.html")
      : path.join(
          distDir,
          route.path.slice(1),
          "index.html"
        );

  fs.mkdirSync(path.dirname(outputPath), {
    recursive: true,
  });

  fs.writeFileSync(outputPath, html, "utf8");

  console.log(`Generated ${route.path} -> ${outputPath}`);
}

console.log(
  "Route-specific SEO HTML generation complete."
);



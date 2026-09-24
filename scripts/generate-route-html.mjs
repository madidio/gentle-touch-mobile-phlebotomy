import fs from "node:fs";
import path from "node:path";

const SITE_NAME = "Gentle Touch Mobile Blood Draw";
const SITE_URL = "https://omahagentletouchlabs.com";
const SOCIAL_IMAGE = `${SITE_URL}/images/Gentle-Touch-Logo.jpg`;

const routes = [
  {
    path: "/",
    title: "Mobile Phlebotomy in Omaha, NE",
    description:
      "Gentle Touch Mobile Blood Draw provides compassionate, professional mobile phlebotomy services throughout the Omaha Metro, including Douglas and Sarpy Counties.",
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

for (const route of routes) {
  const canonical =
    route.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;

  const fullTitle = `${route.title} | ${SITE_NAME}`;

  const seo = `
    <title>${escapeHtml(fullTitle)}</title>
    <meta name="description" content="${escapeHtml(route.description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />

    <meta property="og:title" content="${escapeHtml(fullTitle)}" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SOCIAL_IMAGE}" />
    <meta property="og:image:alt" content="${SITE_NAME}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="en_US" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(route.description)}" />
    <meta name="twitter:image" content="${SOCIAL_IMAGE}" />
  `;

  let html = removeExistingSeo(baseHtml);
  html = html.replace("</head>", `${seo}\n</head>`);

  const outputPath =
    route.path === "/"
      ? path.join(distDir, "index.html")
      : path.join(distDir, route.path.slice(1), "index.html");

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html, "utf8");

  console.log(`Generated ${route.path} -> ${outputPath}`);
}

console.log("Route-specific SEO HTML generation complete.");
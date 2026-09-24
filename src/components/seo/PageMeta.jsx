import { useEffect } from "react";

const SITE_NAME = "Gentle Touch Mobile Blood Draw";
const SITE_URL = "https://omahagentletouchlabs.com";
const SOCIAL_IMAGE = `${SITE_URL}/images/Gentle-Touch-Logo.jpg`;

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function setCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }

  link.href = href;
}

export default function PageMeta({
  title,
  description,
  path = "/",
  noIndex = false,
}) {
  useEffect(() => {
    const canonical =
      path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;

    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : `Mobile Phlebotomy in Omaha, NE | ${SITE_NAME}`;

    document.title = fullTitle;

    setMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });

    setMeta('meta[name="robots"]', {
      name: "robots",
      content: noIndex ? "noindex, nofollow" : "index, follow",
    });

    setMeta('meta[property="og:title"]', {
      property: "og:title",
      content: fullTitle,
    });

    setMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });

    setMeta('meta[property="og:type"]', {
      property: "og:type",
      content: "website",
    });

    setMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonical,
    });

    setMeta('meta[property="og:image"]', {
      property: "og:image",
      content: SOCIAL_IMAGE,
    });

    setMeta('meta[property="og:image:alt"]', {
      property: "og:image:alt",
      content: "Gentle Touch Mobile Blood Draw",
    });

    setMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: SITE_NAME,
    });

    setMeta('meta[property="og:locale"]', {
      property: "og:locale",
      content: "en_US",
    });

    setMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });

    setMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: fullTitle,
    });

    setMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });

    setMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: SOCIAL_IMAGE,
    });

    setCanonical(canonical);
  }, [title, description, path, noIndex]);

  return null;
}
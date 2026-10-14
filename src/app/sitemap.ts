import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/reservation`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/mentions-legales`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/confidentialite`, changeFrequency: "yearly", priority: 0.2 },
  ];
}

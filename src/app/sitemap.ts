import { MetadataRoute } from "next";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://explodebd.com";
  const locales = ["en", "bn"];

  const staticPages = [
    "",
    "/shop",
    "/new-arrivals",
    "/best-sellers",
    "/offers",
    "/about",
    "/contact",
    "/cart",
    "/checkout",
    "/wishlist",
    "/track-order",
    "/faq",
    "/size-guide",
    "/shipping-policy",
    "/return-exchange-policy",
    "/privacy-policy",
    "/terms",
  ];

  const routes: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    // Static Routes
    staticPages.forEach((page) => {
      routes.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: "2026-11-21",
        changeFrequency: page === "" || page === "/shop" ? "daily" : "weekly",
        priority: page === "" ? 1.0 : page === "/shop" ? 0.9 : 0.7,
      });
    });

    // Category Routes
    CATEGORIES.forEach((cat) => {
      routes.push({
        url: `${baseUrl}/${locale}/category/${cat.slug}`,
        lastModified: "2026-11-21",
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });

    // Product Routes
    PRODUCTS.forEach((prod) => {
      routes.push({
        url: `${baseUrl}/${locale}/product/${prod.slug}`,
        lastModified: "2026-11-21",
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });
  });

  return routes;
}

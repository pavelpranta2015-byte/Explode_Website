# EXPLODE BD — Frontend E-Commerce Platform

> **"Increase your beauty with modesty."**  
> Official Website: [https://explodebd.com](https://explodebd.com)  
> Official Facebook Page: [https://www.facebook.com/explodebd](https://www.facebook.com/explodebd)

EXPLODE BD is a premier modest fashion and hijab e-commerce brand operating in Bangladesh. This repository contains the complete, production-ready, SEO-optimized frontend built with **Next.js 15+ (App Router)**, **TypeScript**, **Tailwind CSS**, and **Zustand**.

---

## 1. Brand Design System

### Official Logo
- File location: `public/images/explode-logo.png`
- Displayed prominently in the top-left corner of the header and footer, preserving original wordmark, royal crown icon, and official tagline.

### Colour Palette Tokens
- **Olive Green**: `#68734B` (Primary brand accent, buttons, badges)
- **Deep Olive**: `#465137` (Dark contrast elements, announcement bar, hero headings)
- **Beige**: `#D7C5A5` (Secondary brand luxury accents, borders, tags)
- **Warm Cream**: `#F5F0E6` (Warm secondary background)
- **Cream Light**: `#FAF7F2` (Body background)
- **Charcoal**: `#292B26` (Text body, dark buttons, footer)
- **Muted Grey**: `#77786F` (Subtitles, metadata, specs)
- **White**: `#FFFFFF` (Cards, inputs, modals)

### Typography
- **Headings (English)**: *Playfair Display* (Google Fonts)
- **Body Text**: *Manrope* (Google Fonts)
- **Bangla**: *Hind Siliguri* (Google Fonts)

---

## 2. Multi-Page Architecture

All routes support **English (`/en/...`)** and **Bangla (`/bn/...`)** with seamless language switching:

| Page | Route | Description |
|---|---|---|
| **Homepage** | `/[locale]` | Hero campaign, curated categories, best sellers, brand story, new arrivals, promotional perks, customer reviews, newsletter |
| **Shop All** | `/[locale]/shop` | Interactive catalogue with live search, category filter, price slider (৳150–৳3,000), size filter, in-stock toggle, and sorting |
| **Categories** | `/[locale]/category/[slug]` | Category-specific product catalogue with breadcrumbs and structured data |
| **Product Detail** | `/[locale]/product/[slug]` | Multi-image gallery, variant selectors (color & size), pricing, stock check, Add to Cart, Buy Now, WhatsApp prefilled order, and related items |
| **New Arrivals** | `/[locale]/new-arrivals` | Recently launched modest fashion pieces |
| **Best Sellers** | `/[locale]/best-sellers` | Top-rated and most ordered ready hijabs & prayer suits |
| **Special Offers** | `/[locale]/offers` | Active vouchers (`EXPLODE10`, `WELCOME100`) and Free Delivery bundles |
| **About Us** | `/[locale]/about` | EXPLODE BD brand philosophy, modest values, and fabric standards |
| **Contact** | `/[locale]/contact` | Direct WhatsApp integration, Facebook link, customer care hotline, and inquiry form |
| **Cart** | `/[locale]/cart` | Persistent cart (localStorage), Free Shipping progress bar (threshold ৳2,000), coupon code application |
| **Checkout** | `/[locale]/checkout` | Bangladesh phone validation, district selector, Inside/Suburbs/Outside Dhaka rates, Cash on Delivery, manual bKash/Nagad |
| **Wishlist** | `/[locale]/wishlist` | Persistent wishlist, quick Move-to-Cart |
| **Customer Account** | `/[locale]/account` | Integration-ready interface for Profile, Order History, Addresses, and Loyalty Points |
| **Track Order** | `/[locale]/track-order` | Live order invoice and phone status tracking interface |
| **Size Guide** | `/[locale]/size-guide` | Detailed measurement charts for L/XL ready hijabs, salat suits, khimars, and abayas |
| **Shipping Policy** | `/[locale]/shipping-policy` | Courier terms (Steadfast/RedX/Pathao) and rates (৳70 / ৳100 / ৳130) |
| **Return Policy** | `/[locale]/return-exchange-policy` | 7-day hassle-free exchange terms |
| **Privacy Policy** | `/[locale]/privacy-policy` | Customer data protection commitment |
| **Terms of Service**| `/[locale]/terms` | Commercial guidelines and ordering terms |

---

## 3. Technology Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: Strict TypeScript
- **Styling**: Tailwind CSS 4 with custom brand tokens
- **State Management**: Zustand with persistent `localStorage` middleware (`useCartStore`, `useWishlistStore`)
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form & Zod
- **SEO & Structured Data**: Dynamic OpenGraph, JSON-LD schemas (`Organization`, `WebSite`, `Product`, `Offer`, `BreadcrumbList`), dynamic `sitemap.xml`, and `robots.txt`

---

## 4. Local Development Setup

### Prerequisites
- Node.js version 18.18 or higher (Node.js 20+ recommended)
- npm version 9+

### Installation

```bash
# 1. Clone or navigate to the project directory
cd "Explode Website"

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will automatically redirect to [http://localhost:3000/en](http://localhost:3000/en).

---

## 5. Build and Production Verification

```bash
# Run production build
npm run build

# Start production server
npm run start
```

---

## 6. Backend Integration Roadmap (Supabase Ready)

The frontend features a clean **Data Access Layer** (`src/services/api.ts`) that decouples UI components from data sources.

### Tables & Operations Configured for Supabase:

1. **`products` & `product_variants`**:
   - `GET /rest/v1/products` (Filters, pagination, category slug)
   - Real-time stock counts
2. **`orders` & `order_items`**:
   - `POST /rest/v1/orders` (Insert customer name, phone, address, items, payment method, TrxID)
   - Order tracking by `order_number` and `customer_phone`
3. **`profiles` / Customers**:
   - Supabase Auth (OTP / SMS login for Bangladesh phone numbers)
   - Saved shipping addresses and loyalty points
4. **`coupons`**:
   - Server-side coupon verification and single-use limits
5. **`reviews`**:
   - Verified customer ratings and photo submissions

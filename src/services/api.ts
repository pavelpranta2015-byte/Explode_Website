import { Product, Category, Review, Order, Customer, Coupon } from "@/types";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { REVIEWS } from "@/data/reviews";

/**
 * EXPLODE BD Data Access Layer / Service Interface
 * Designed for future Supabase or REST API integration.
 * All UI components consume this service interface rather than accessing mock data directly.
 */

export interface ProductFilterParams {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  inStockOnly?: boolean;
  searchQuery?: string;
  sortBy?: "featured" | "price-asc" | "price-desc" | "newest" | "bestseller";
}

export const productService = {
  async getAllProducts(filters?: ProductFilterParams): Promise<Product[]> {
    let result = [...PRODUCTS];

    if (filters?.categorySlug) {
      result = result.filter((p) => p.categorySlug === filters.categorySlug);
    }

    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.en.toLowerCase().includes(q) ||
          p.title.bn.toLowerCase().includes(q) ||
          p.categoryName.en.toLowerCase().includes(q) ||
          p.categoryName.bn.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters?.minPrice !== undefined) {
      result = result.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters?.size) {
      result = result.filter((p) => p.availableSizes.includes(filters.size!));
    }

    if (filters?.inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "price-asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "newest":
          result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
          break;
        case "bestseller":
          result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
          break;
        case "featured":
        default:
          result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }

    return result;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const product = PRODUCTS.find((p) => p.slug === slug);
    return product || null;
  },

  async getRelatedProducts(categorySlug: string, currentProductId: string, limit = 4): Promise<Product[]> {
    return PRODUCTS.filter(
      (p) => p.categorySlug === categorySlug && p.id !== currentProductId
    ).slice(0, limit);
  },

  async getFeaturedProducts(limit = 6): Promise<Product[]> {
    return PRODUCTS.filter((p) => p.isFeatured || p.isBestSeller).slice(0, limit);
  },

  async getNewArrivals(limit = 6): Promise<Product[]> {
    return PRODUCTS.filter((p) => p.isNewArrival).slice(0, limit);
  },

  async getBestSellers(limit = 6): Promise<Product[]> {
    return PRODUCTS.filter((p) => p.isBestSeller).slice(0, limit);
  },
};

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    return CATEGORIES;
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const category = CATEGORIES.find((c) => c.slug === slug);
    return category || null;
  },

  async getFeaturedCategories(): Promise<Category[]> {
    return CATEGORIES.filter((c) => c.featured);
  },
};

export const reviewService = {
  async getAllReviews(): Promise<Review[]> {
    return REVIEWS;
  },
};

export const orderService = {
  /**
   * Stubs order creation. When Supabase is connected,
   * this will call `supabase.from('orders').insert(...)`
   */
  async createOrder(orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "status">): Promise<{ success: boolean; orderNumber: string }> {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `EX-${randomSuffix}`;

    // Here we simulate saving to local storage or future DB
    return {
      success: true,
      orderNumber,
    };
  },

  async trackOrder(orderNumber: string, phone: string): Promise<{
    found: boolean;
    order?: Partial<Order>;
    statusText?: string;
  }> {
    // Frontend demo lookup
    const trimmed = orderNumber.trim().toUpperCase();
    if (trimmed.length >= 4 || phone.length >= 10) {
      return {
        found: true,
        order: {
          orderNumber: trimmed.startsWith("EX-") ? trimmed : `EX-${trimmed}`,
          customerPhone: phone,
          status: "confirmed",
          totalAmount: 1850,
        },
        statusText: "Processing in Dhaka Packaging Hub (Handover to Courier within 24 hours)",
      };
    }
    return { found: false };
  },
};

export const couponService = {
  async validateCoupon(code: string): Promise<Coupon | null> {
    const coupons: Coupon[] = [
      {
        code: "EXPLODE10",
        discountType: "percentage",
        discountValue: 10,
        minOrderAmount: 1000,
        description: {
          en: "10% off on modest orders above ৳1,000",
          bn: "১,০০০ টাকার অর্ডারে ১০% বিশেষ ছাড়",
        },
        isValid: true,
      },
      {
        code: "WELCOME100",
        discountType: "fixed",
        discountValue: 100,
        minOrderAmount: 1200,
        description: {
          en: "৳100 flat discount for our beloved sisterhood",
          bn: "১,২০০ টাকার অর্ডারে ১০০ টাকা ক্যাশ ছাড়",
        },
        isValid: true,
      },
    ];

    const match = coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase()
    );
    return match || null;
  },
};

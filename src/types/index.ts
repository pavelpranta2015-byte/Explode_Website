export type Locale = "en" | "bn";

export interface Category {
  id: string;
  slug: string;
  name: {
    en: string;
    bn: string;
  };
  description: {
    en: string;
    bn: string;
  };
  image: string;
  featured?: boolean;
  itemCount?: number;
}

export interface ProductVariant {
  id: string;
  name: {
    en: string;
    bn: string;
  };
  colorName?: {
    en: string;
    bn: string;
  };
  colorHex?: string;
  size?: string; // e.g. "L", "XL", "Free Size"
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockCount?: number;
  sku: string;
  image?: string;
}

export interface Product {
  id: string;
  slug: string;
  title: {
    en: string;
    bn: string;
  };
  shortDescription: {
    en: string;
    bn: string;
  };
  description: {
    en: string;
    bn: string;
  };
  material: {
    en: string;
    bn: string;
  };
  careInstructions?: {
    en: string;
    bn: string;
  };
  measurements?: {
    en: string;
    bn: string;
  };
  price: number;
  originalPrice?: number; // genuine discount if applicable
  discountPercentage?: number;
  categorySlug: string;
  categoryName: {
    en: string;
    bn: string;
  };
  tags: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  images: string[];
  availableColors: {
    name: {
      en: string;
      bn: string;
    };
    hex: string;
  }[];
  availableSizes: string[];
  variants: ProductVariant[];
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
  deliveryInfo: {
    en: string;
    bn: string;
  };
  returnInfo: {
    en: string;
    bn: string;
  };
}

export interface CartItem {
  id: string; // unique item id e.g. `${productId}-${variantId}`
  productId: string;
  variantId: string;
  slug: string;
  title: {
    en: string;
    bn: string;
  };
  image: string;
  price: number;
  originalPrice?: number;
  selectedColor?: {
    en: string;
    bn: string;
    hex?: string;
  };
  selectedSize?: string;
  quantity: number;
  inStock: boolean;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  addresses: Address[];
  rewardPoints: number;
  createdAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  district: string;
  cityArea: string;
  fullAddress: string;
  isDefault?: boolean;
}

export type PaymentMethod = "cod" | "bkash" | "nagad" | "rocket";

export interface OrderItem {
  productId: string;
  variantId: string;
  title: string;
  color?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  alternativePhone?: string;
  deliveryAddress: string;
  district: string;
  cityArea: string;
  deliveryInstructions?: string;
  paymentMethod: PaymentMethod;
  paymentNumber?: string;
  transactionId?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: "fixed" | "percentage";
  discountValue: number;
  minOrderAmount?: number;
  description: {
    en: string;
    bn: string;
  };
  isValid: boolean;
}

export interface Review {
  id: string;
  author: string;
  location?: string;
  rating: number;
  comment: {
    en: string;
    bn: string;
  };
  productTitle?: string;
  date: string;
  verifiedBuyer: boolean;
  image?: string;
}

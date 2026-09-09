export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  brand: string;
  description: string;
  shortDescription: string;
  price: number;
  oldPrice?: number;
  installment?: string;
  images: string[];
  colors?: string[];
  storage?: string[];
  featured?: boolean;
  bestSeller?: boolean;
  new?: boolean;
  sale?: boolean;
  stock: boolean;
  stockQuantity?: number;
  rating?: number;
  reviews?: number;
  specs?: Record<string, string>;
  keywords?: string[];
  inBox?: string[];
  warranty?: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  image: string;
  featured?: boolean;
  keywords?: string[];
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  quantity: number;
  color?: string;
  storage?: string;
}

export interface CheckoutForm {
  name: string;
  phone: string;
  city: string;
  state: string;
  delivery: string;
  notes: string;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "bestseller";

export interface ProductFilters {
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onSale?: boolean;
  colors: string[];
  storage: string[];
}

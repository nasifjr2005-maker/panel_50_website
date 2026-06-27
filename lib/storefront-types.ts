import type { PanelPrice } from "@/lib/data";

export type StoreProductLogo = {
  id?: string;
  url: string;
  type: string;
  name: string;
  isFeatured: boolean;
};

export type StoreProduct = {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  categoryName?: string;
  featuredImageId?: string | null;
  logo?: StoreProductLogo | null;
};

export type StoreCategory = {
  id?: string;
  category: string;
  name?: string;
  description: string;
  panels?: string[];
  products?: StoreProduct[];
};

export type StoreCatalog = {
  categories: StoreCategory[];
  pricing: Record<string, PanelPrice[]>;
  logos: Record<string, StoreProductLogo | null>;
};

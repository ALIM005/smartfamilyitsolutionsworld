// lib/serialize.ts
// ডাটাবেসের ডকুমেন্টকে ব্রাউজারে পাঠানোর উপযোগী (ObjectId → string) আকারে রূপান্তর।
import { unitPriceAfterDiscount } from './pricing';

type IdLike = { toString(): string };

export type ProductLike = {
  _id: IdLike;
  name: string;
  slug: string;
  sku?: string | null;
  image: string;
  category: string;
  brand?: string | null;
  price: number;
  discount?: number | null;
  stock: number;
  sold?: number | null;
  rating?: number | null;
  colors?: string[] | null;
  sizes?: string[] | null;
  tags?: string[] | null;
  featured?: boolean | null;
  flashSale?: boolean | null;
  active?: boolean | null;
};

export type PublicProduct = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  image: string;
  category: string;
  brand: string;
  price: number;
  discount: number;
  finalPrice: number;
  stock: number;
  sold: number;
  rating: number;
  colors: string[];
  sizes: string[];
  tags: string[];
  featured: boolean;
  flashSale: boolean;
  active: boolean;
};

export function toProduct(p: ProductLike): PublicProduct {
  const discount = p.discount ?? 0;
  return {
    id: p._id.toString(),
    slug: p.slug,
    name: p.name,
    sku: p.sku ?? '',
    image: p.image,
    category: p.category,
    brand: p.brand ?? '',
    price: p.price,
    discount,
    finalPrice: unitPriceAfterDiscount(p.price, discount),
    stock: p.stock,
    sold: p.sold ?? 0,
    rating: p.rating ?? 0,
    colors: p.colors ?? [],
    sizes: p.sizes ?? [],
    tags: p.tags ?? [],
    featured: Boolean(p.featured),
    flashSale: Boolean(p.flashSale),
    active: p.active !== false,
  };
}

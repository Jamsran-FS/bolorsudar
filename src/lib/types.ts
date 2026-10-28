export interface Category {
  id: number;
  name: string;
  slug: string;
  bg: string;
  fg: string;
  sortOrder: number;
  bookCount: number;
}

export interface Author {
  id: number;
  name: string;
  slug: string;
  initials: string;
  bio: string | null;
  bg: string;
  fg: string;
  isFeatured: boolean;
  bookCount: number;
}

export interface BookCard {
  id: number;
  slug: string;
  title: string;
  price: number;
  oldPrice: number | null;
  coverColor: string;
  coverImage: string | null;
  tag: string | null;
  stock: number;
  isNew: boolean;
  isBestseller: boolean;
  isComingSoon: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  authorId: number | null;
  categoryId: number | null;
  authorName: string | null;
  authorSlug: string | null;
  categoryName: string | null;
  categorySlug: string | null;
}

export interface BookDetail extends BookCard {
  summary: string | null;
  description: string | null;
  badge: string | null;
  translator: string | null;
  pages: number | null;
  binding: "soft" | "hard" | null;
  isbn: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  body: string;
  createdAt: string;
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface OrderSummary {
  id: number;
  customerName: string;
  phone: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  itemCount: number;
}

export interface OrderDetail {
  id: number;
  customerName: string;
  phone: string;
  email: string | null;
  address: string;
  note: string | null;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: { id: number; bookId: number | null; title: string; price: number; quantity: number }[];
}

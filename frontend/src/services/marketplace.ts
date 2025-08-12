export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  status: "active" | "inactive" | "draft" | "archived";
  isFeatured: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  images?: string[];
}

export interface Listing extends Product {
  location?: string;
}

export interface Analytics {
  totalSales: number;
  activeListings: number;
  featuredBoostCount: number;
  views: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  relevanceScore: number;
}

export interface ChatSession {
  id: string;
  sellerName: string;
  lastMessage: string;
  updatedAt: string;
}

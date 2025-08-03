export interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
}

export interface Category {
  id: string; // The API uses 'id' for category filtering
  name: string;
  market_cap: number;
}

// Types for GNews API
export interface Article {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: Source;
}

export interface Source {
  name: string;
  url: string;
}
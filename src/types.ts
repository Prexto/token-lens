export interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
}

export interface Category {
  id: string; // The API uses 'id' for category filtering
  name: string;
  market_cap: number;
}

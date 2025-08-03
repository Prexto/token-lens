import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Coin } from '../types';

const CoinList = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
            sparkline: false,
          },
        });
        setCoins(response.data);
      } catch (error) {
        console.error('Error fetching coin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-400">Loading...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl mb-4">Cryptocurrency Prices</h2>
      <ul>
        {coins.map((coin) => (
          <li key={coin.id} className="mb-2 p-2 bg-gray-800 rounded">
            {coin.name} ({coin.symbol.toUpperCase()}): ${coin.current_price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoinList;

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
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 border border-gray-700">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-4 text-left">#</th>
            <th className="p-4 text-left">Moneda</th>
            <th className="p-4 text-left">Precio</th>
            <th className="p-4 text-left">24h %</th>
            <th className="p-4 text-left">Capitalización de Mercado</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, index) => (
            <tr key={coin.id} className="border-b border-gray-700 hover:bg-gray-700">
              <td className="p-4">{index + 1}</td>
              <td className="p-4 flex items-center">
                <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-4" />
                <div>
                  <p className="font-bold">{coin.name}</p>
                  <p className="text-gray-400 text-sm">{coin.symbol.toUpperCase()}</p>
                </div>
              </td>
              <td className="p-4">${coin.current_price.toLocaleString()}</td>
              <td className={`p-4 ${coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td className="p-4">${coin.market_cap.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoinList;

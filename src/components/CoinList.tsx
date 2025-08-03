import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import type { Coin, Category } from '../types';

const CoinList = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Coin | null; direction: 'asc' | 'desc' }>({ key: 'market_cap_rank', direction: 'asc' });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/categories', {
          params: {
            order: 'market_cap_desc'
          }
        });
        // Filter to top 25 categories to ensure relevance and avoid empty ones
        setCategories(response.data.slice(0, 25));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      try {
        const params: any = {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false,
          price_change_percentage: '7d',
        };

        if (selectedCategory !== 'all') {
          params.category = selectedCategory;
        }

        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', { params });
        setCoins(response.data);
      } catch (error) {
        console.error('Error fetching coin data:', error);
        setCoins([]); // Clear coins on error
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [selectedCategory]);

  const filteredCoins = coins.filter((coin) =>
    (coin.name?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
    (coin.symbol?.toLowerCase() ?? '').includes(search.toLowerCase())
  );

  const sortedAndFilteredCoins = useMemo(() => {
    let sortableItems = [...filteredCoins];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key as keyof Coin] ?? 0;
        const valB = b[sortConfig.key as keyof Coin] ?? 0;

        if (valA < valB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredCoins, sortConfig]);

  const handleSort = (key: keyof Coin) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return <p className="text-center text-gray-400">Loading...</p>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar en la categoría actual..."
          className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200"
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200"
          value={selectedCategory}
        >
          <option value="all">Top 25 Categorías</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-gray-800 border-collapse">
          <thead className="bg-gray-900">
            <tr>
              {['#', 'Moneda', 'Precio', '24h %', '7d %', 'Capitalización de Mercado'].map((header, index) => {
                const sortKeyMap: (keyof Coin | null)[] = ['market_cap_rank', null, 'current_price', 'price_change_percentage_24h', 'price_change_percentage_7d_in_currency', 'market_cap'];
                const key = sortKeyMap[index];
                const isSortable = key !== null;
                return (
                  <th 
                    key={header} 
                    className={`p-4 text-sm font-semibold text-gray-300 ${isSortable ? 'cursor-pointer hover:bg-gray-700' : ''} ${index > 1 ? 'text-right' : 'text-left'}`}
                    onClick={() => isSortable && handleSort(key)}
                  >
                    {header}
                    {sortConfig.key === key && (
                      <span className="ml-2">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredCoins.map((coin) => {
              const priceChange = coin.price_change_percentage_24h ?? 0;
              return (
                <tr key={coin.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200">
                  <td className="p-4 text-gray-400 font-medium">{coin.market_cap_rank ?? 'N/A'}</td>
                  <td className="p-4 flex items-center">
                    <img src={coin.image} alt={coin.name} className="w-8 h-8 mr-4 rounded-full" />
                    <div>
                      <p className="font-bold text-white">{coin.name ?? 'Unknown Coin'}</p>
                      <p className="text-gray-400 text-sm">{coin.symbol?.toUpperCase() ?? 'N/A'}</p>
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono text-white">
                    ${coin.current_price?.toLocaleString() ?? 'N/A'}
                  </td>
                  <td className={`p-4 text-right font-semibold ${priceChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {priceChange.toFixed(2)}%
                  </td>
                  <td className={`p-4 text-right font-semibold ${coin.price_change_percentage_7d_in_currency > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {(coin.price_change_percentage_7d_in_currency ?? 0).toFixed(2)}%
                  </td>
                  <td className="p-4 text-right font-mono text-gray-300">
                    ${coin.market_cap?.toLocaleString() ?? 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoinList;

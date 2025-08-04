import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import type { Coin, Category } from '../types';

const CoinList = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Coin | null; direction: 'asc' | 'desc' }>({ key: 'market_cap_rank', direction: 'asc' });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/coingecko/coins/categories', {
          params: {
            order: 'market_cap_desc'
          }
        });
        setCategories(response.data.slice(0, 25));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const fetchCoins = async (retry = false) => {
    if (!retry) {
      setLoading(true);
      setError(null);
    }
    
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

      const response = await axios.get('/api/coingecko/coins/markets', {
        params: params,
        timeout: 15000 // 15 second timeout
      });
      
      // Check if response indicates API unavailability
      if (response.data?.error && response.data?.status === 403) {
        throw new Error('API temporarily unavailable');
      }
      
      setCoins(response.data);
      setError(null);
      setRetryCount(0);
    } catch (error: any) {
      console.error('Error fetching coin data:', error);
      
      let errorMessage = 'Failed to load cryptocurrency data';
      
      if (error.response?.status === 403 || error.message?.includes('403')) {
        errorMessage = 'CoinGecko API is temporarily unavailable due to high traffic. Please try again in a few moments.';
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network and try again.';
      }
      
      setError(errorMessage);
      setCoins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchCoins(true);
  };

  useEffect(() => {
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

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return 'N/A';

    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: 'USD',
    };

    if (price < 0.01 && price > 0) {
      options.minimumFractionDigits = 2;
      options.maximumFractionDigits = 8;
    } else {
      options.minimumFractionDigits = 2;
      options.maximumFractionDigits = 2;
    }

    return price.toLocaleString('en-US', options);
  };

  if (loading) {
    return <p className="text-center text-xl font-medium">Loading data...</p>;
  }

  // Error state with retry option
  if (error && coins.length === 0) {
    return (
      <div className="text-center space-y-6 p-8 rounded-2xl shadow-neumorphic-light-convex dark:shadow-neumorphic-dark-convex">
        <div className="space-y-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Unable to Load Data</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">{error}</p>
          
          <button
            onClick={handleRetry}
            disabled={loading}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold rounded-xl shadow-neumorphic-light-convex dark:shadow-neumorphic-dark-convex transition-colors duration-200 disabled:cursor-not-allowed"
          >
            {loading ? 'Retrying...' : `Try Again ${retryCount > 0 ? `(${retryCount})` : ''}`}
          </button>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
            <p>Possible solutions:</p>
            <ul className="list-disc list-inside space-y-1 text-left max-w-sm mx-auto">
              <li>Wait a few minutes and try again</li>
              <li>Check your internet connection</li>
              <li>Clear your browser cache</li>
              <li>The service may be experiencing high traffic</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl shadow-neumorphic-light-convex dark:shadow-neumorphic-dark-convex">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-light-text/50 dark:text-dark-text/50 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
            </span>
            <input
              type="text"
              placeholder="Search by name or symbol..."
              className="w-full pl-12 pr-4 py-4 bg-light-bg dark:bg-dark-bg rounded-xl shadow-neumorphic-light-concave dark:shadow-neumorphic-dark-concave focus:outline-none transition-shadow"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative flex-grow">
            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-4 bg-light-bg dark:bg-dark-bg rounded-xl shadow-neumorphic-light-concave dark:shadow-neumorphic-dark-concave focus:outline-none appearance-none"
              value={selectedCategory}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-light-text/50 dark:text-dark-text/50 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </span>
          </div>
        </div>
      </div>

      <div className="p-2 md:p-4 rounded-2xl shadow-neumorphic-light-convex dark:shadow-neumorphic-dark-convex">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                {['#', 'Coin', 'Price', '24h %', '7d %', 'Market Cap'].map((header, index) => {
                  const sortKeyMap: (keyof Coin | null)[] = ['market_cap_rank', null, 'current_price', 'price_change_percentage_24h', 'price_change_percentage_7d_in_currency', 'market_cap'];
                  const key = sortKeyMap[index];
                  const isSortable = key !== null;
                  return (
                    <th 
                      key={header} 
                      className={`p-4 text-sm font-bold ${isSortable ? 'cursor-pointer' : ''} ${index > 1 ? 'text-right' : 'text-left'}`}
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
                const priceChange7d = coin.price_change_percentage_7d_in_currency ?? 0;
                return (
                  <tr key={coin.id} className="border-t border-light-text/10 dark:border-dark-text/10">
                    <td className="p-4 font-medium">{coin.market_cap_rank ?? 'N/A'}</td>
                    <td className="p-4 flex items-center gap-4">
                      <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full shadow-neumorphic-light-convex dark:shadow-neumorphic-dark-convex" />
                      <div>
                        <p className="font-bold text-base">{coin.name ?? 'Unknown Coin'}</p>
                        <p className="text-sm opacity-70">{coin.symbol?.toUpperCase() ?? 'N/A'}</p>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono font-bold">
                      {formatPrice(coin.current_price)}
                    </td>
                    <td className={`p-4 text-right font-semibold ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {priceChange.toFixed(2)}%
                    </td>
                    <td className={`p-4 text-right font-semibold ${priceChange7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {priceChange7d.toFixed(2)}%
                    </td>
                    <td className="p-4 text-right font-mono opacity-70">
                      ${coin.market_cap?.toLocaleString() ?? 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CoinList;
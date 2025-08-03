import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Article } from '../types';

const NewsFeed = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      const apiKey = import.meta.env.VITE_GNEWS_API_KEY;

      if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        setError('GNews API key is missing. Please add it to your .env file.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://gnews.io/api/v4/search', {
          params: {
            q: 'cryptocurrencies',
            lang: 'en',
            max: 6, // Fetch 6 articles
            apikey: apiKey,
          },
        });
        setArticles(response.data.articles);
      } catch (err) {
        setError('Failed to fetch news. Please check the console for more details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Trending News</h2>
      
      {loading && <p className="text-center">Loading news...</p>}
      
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <a href={article.url} key={index} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-2xl shadow-neumorphic-light-convex dark:shadow-neumorphic-dark-convex hover:shadow-neumorphic-light-concave dark:hover:shadow-neumorphic-dark-concave transition-shadow duration-200">
              <img src={article.image} alt={article.title} className="w-full h-40 object-cover rounded-xl mb-4" />
              <h3 className="font-bold text-lg mb-2">{article.title}</h3>
              <p className="text-sm opacity-80">{article.source.name}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
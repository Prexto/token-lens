import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Article } from '../types';

const NewsFeed = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    if (!articles.length) {
      setLoading(true);
    }
    setError(null);

    const apiKey = import.meta.env.VITE_GNEWS_API_KEY;

    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      setError('GNews API key is missing. Please add it to your .env file.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('/api/gnews/search', {
        params: {
          q: 'cryptocurrencies',
          lang: 'en',
          max: 10,
          apikey: apiKey, // Pass the key as a param
        },
      });
      setArticles(response.data.articles);
    } catch (err) {
      setError('Failed to fetch news.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const intervalId = setInterval(fetchNews, 6 * 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const newsContent = articles.map((article, index) => (
    <a 
      href={article.url} 
      key={index} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex flex-col w-64 flex-shrink-0 p-3 rounded-2xl shadow-neumorphic-light-convex dark:shadow-neumorphic-dark-convex hover:shadow-neumorphic-light-concave dark:hover:shadow-neumorphic-dark-concave transition-shadow duration-200"
    >
      <img src={article.image} alt={article.title} className="w-full h-32 object-cover rounded-xl mb-3" />
      <div className="flex flex-col flex-grow">
        <h3 className="font-bold text-base mb-2 flex-grow">{article.title}</h3>
        <p className="text-xs opacity-80 mt-auto">{article.source.name}</p>
      </div>
    </a>
  ));

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Trending News</h2>
      
      {loading && <p className="text-center">Loading news...</p>}
      
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && articles.length > 0 && (
        <div className="marquee-container py-4">
          <div className="marquee">
            <div className="marquee-content">
              {newsContent}
            </div>
            <div className="marquee-content" aria-hidden="true">
              {newsContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;

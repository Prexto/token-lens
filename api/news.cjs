const axios = require('axios');

module.exports = async (request, response) => {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: 'API key is not configured.' });
  }

  try {
    const apiResponse = await axios.get('https://gnews.io/api/v4/search', {
      params: {
        q: 'cryptocurrencies',
        lang: 'en',
        max: 10,
        apikey: apiKey,
      },
    });

    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return response.status(200).json(apiResponse.data);

  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Failed to fetch news from GNews API.' });
  }
};

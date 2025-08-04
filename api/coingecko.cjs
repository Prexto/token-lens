const axios = require('axios');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path } = req.query; // Get the path from the query parameter
  const queryParams = { ...req.query };
  delete queryParams.path; // Remove our custom path parameter

  if (!path) {
    return res.status(400).json({ error: 'Path parameter is required' });
  }

  try {
    const apiUrl = `https://api.coingecko.com/api/v3/${path}`;
    console.log(`Fetching: ${apiUrl} with params:`, queryParams);
    
    const apiResponse = await axios.get(apiUrl, {
      params: queryParams,
      headers: {
        'User-Agent': 'TokenLens/1.0 (https://token-lens.vercel.app)',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
      },
      timeout: 10000 // 10 second timeout
    });

    // Cache for 5 minutes (300 seconds)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(apiResponse.data);

  } catch (error) {
    console.error(`Error proxying CoinGecko API for path: ${path}`, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    // Forward the status code from CoinGecko if available, otherwise 500
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
    
    return res.status(statusCode).json({ 
      error: 'Failed to fetch data from CoinGecko via proxy.', 
      details: errorMessage,
      path: path,
      params: queryParams
    });
  }
};

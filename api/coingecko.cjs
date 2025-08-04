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
    
    // Enhanced headers to avoid 403 blocks
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
      'Referer': 'https://www.coingecko.com/',
      'Origin': 'https://www.coingecko.com'
    };
    
    const apiResponse = await axios.get(apiUrl, {
      params: queryParams,
      headers: headers,
      timeout: 15000, // 15 second timeout
      maxRedirects: 5,
      validateStatus: function (status) {
        return status < 500; // Resolve only if the status code is less than 500
      }
    });

    // Cache for 5 minutes (300 seconds)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(apiResponse.data);

  } catch (error) {
    console.error(`Error proxying CoinGecko API for path: ${path}`, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: apiUrl
    });
    
    // Special handling for 403 errors - try with different approach
    if (error.response?.status === 403) {
      console.log('403 detected, trying alternative approach...');
      
      try {
        // Wait a bit and try with minimal headers
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const fallbackResponse = await axios.get(apiUrl, {
          params: queryParams,
          headers: {
            'User-Agent': 'curl/7.68.0',
            'Accept': '*/*'
          },
          timeout: 10000
        });
        
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
        return res.status(200).json(fallbackResponse.data);
        
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError.message);
        
        // Return a user-friendly error for 403
        return res.status(200).json({
          error: 'API temporarily unavailable',
          message: 'CoinGecko API is experiencing high traffic. Please try again in a few moments.',
          status: 403,
          fallback: true
        });
      }
    }
    
    // Forward the status code from CoinGecko if available, otherwise 500
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
    
    return res.status(statusCode).json({ 
      error: 'Failed to fetch data from CoinGecko via proxy.', 
      details: errorMessage,
      path: path,
      params: queryParams,
      timestamp: new Date().toISOString()
    });
  }
};

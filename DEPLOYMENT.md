# Deployment Checklist for Vercel

## Pre-deployment Steps

### 1. Environment Variables
- [ ] Ensure `.env` is NOT committed to git (check `.gitignore`)
- [ ] Verify `.env.example` exists with placeholder values
- [ ] Add `VITE_GNEWS_API_KEY` to Vercel Dashboard:
  1. Go to Vercel Dashboard → Your Project → Settings
  2. Navigate to "Environment Variables"
  3. Add: `VITE_GNEWS_API_KEY` = `7d35a6b9db93fed82c47a051746d29b8`
  4. Set for: Production, Preview, and Development

### 2. Build Configuration
- [ ] Verify `vercel.json` is properly configured
- [ ] Check that API routes are correctly set up
- [ ] Ensure `api/coingecko.cjs` is working locally

### 3. API Endpoints Verification
- [ ] CoinGecko API proxy: `/api/coingecko/*` 
- [ ] GNews API proxy: `/api/gnews/*`

## Deployment Commands

### Option 1: Automatic Git Deployment
```bash
git add .
git commit -m "feat: prepare for production deployment"
git push origin main
```

### Option 2: Manual Deployment
```bash
npm run build
vercel --prod
```

## Post-deployment Verification

### Test these endpoints in production:
1. **CoinGecko API**: 
   - `https://your-app.vercel.app/api/coingecko/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1`

2. **GNews API**: 
   - `https://your-app.vercel.app/api/gnews/search?q=cryptocurrency&lang=en&max=5&apikey=your_key`

3. **Frontend Routes**:
   - Main app loads correctly
   - Dark/Light theme toggle works
   - Coin data displays properly
   - News feed loads (if API key is set)

## Troubleshooting

### Common Issues:
1. **Environment variable not found**: Check Vercel Dashboard settings
2. **CORS errors**: Verify API proxy configuration in `vercel.json`
3. **Build failures**: Check TypeScript compilation errors
4. **API timeouts**: Verify Vercel function timeout settings
5. **403 Forbidden errors from CoinGecko**:
   - This is the most common issue in production
   - CoinGecko blocks requests from certain IPs/User-Agents
   - The proxy includes fallback mechanisms and retry logic
   - Users will see a friendly error message with retry button
   - Usually resolves after a few minutes or retries

### Debug Commands:
```bash
# Check build locally
npm run build
npm run preview

# Check environment
echo $VITE_GNEWS_API_KEY

# Verify API endpoints locally
curl http://localhost:5173/api/coingecko/ping
```

## Performance Optimizations Applied

1. **Caching**: API responses cached for 5 minutes
2. **Stale-while-revalidate**: Serves stale content while fetching fresh data
3. **Timeout handling**: 10-second timeout for API calls
4. **Error handling**: Graceful degradation for API failures

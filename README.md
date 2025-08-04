# Token Lens

A minimalist and elegant cryptocurrency tracker featuring a clean, neumorphic user interface. Token Lens provides real-time market data, allowing users to effortlessly monitor the top cryptocurrencies. Built with React, TypeScript, and Vite for a fast and modern web experience.

---

## ✨ Features

- **Real-Time Data**: Fetches the latest cryptocurrency data from the CoinGecko API.
- **Advanced Filtering**: Easily search for coins by name or symbol.
- **Category Sorting**: Filter the view to show coins from specific categories (e.g., DeFi, Smart Contract Platforms).
- **Interactive Table**: Sort data by rank, price, 24h/7d performance, and market cap.
- **Responsive Design**: A clean and usable interface on both desktop and mobile devices.
- **Light & Dark Modes**: A beautifully crafted theme toggle for comfortable viewing in any lighting condition.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **API**: [CoinGecko Public API](https://www.coingecko.com/en/api)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Prexto/token-lens.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd token-lens
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Set up environment variables:**
    ```bash
    cp .env.example .env
    ```
    Edit `.env` and add your GNews API key:
    ```
    VITE_GNEWS_API_KEY="your_actual_api_key_here"
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 🚀 Deployment on Vercel

### Environment Variables Setup

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add: `VITE_GNEWS_API_KEY` with your GNews API key value

2. **Deploy:**
   ```bash
   npm run build
   vercel --prod
   ```

### API Configuration

The app uses:
- **CoinGecko API**: Public API for cryptocurrency data (no key required)
- **GNews API**: Requires API key for news articles
- **Vercel Serverless Functions**: For API proxying to avoid CORS issues

## 📄 License

This project is licensed under the MIT License.

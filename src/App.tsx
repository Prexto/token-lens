import './App.css';
import CoinList from './components/CoinList';

function App() {
  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Crypto Info App</h1>
      <main>
        <CoinList />
      </main>
    </div>
  );
}

export default App;

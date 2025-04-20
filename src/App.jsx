import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import SearchPage from './pages/search/SearchPage';
import DraughtsPage from './pages/draughts/DraughtsPage';
import './pages/draughts/draughts.css';

function App() {
  return (
    <div className="app-wrapper">
      <Navigation />

      <div className="app-container">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/draughts" element={<DraughtsPage />} />
        </Routes>

        <footer>
          <p>© 2025 Search Algorithms & Games</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

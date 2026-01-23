import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppRoutes from './routes/AppRoutes';
import { NotificationCenter } from './components/NotificationCenter';
import { Header } from './components/Header';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
          <div className="fixed inset-0 pointer-events-none z-[9999]">
            <NotificationCenter />
          </div>
          <Header />
          <AppRoutes />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;

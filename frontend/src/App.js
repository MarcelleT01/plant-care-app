import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Components
import PlantList from './components/PlantList';
import AddPlant from './components/AddPlant';
import PlantDetail from './components/PlantDetail';
import WateringHistory from './components/WateringHistory';
import Notifications from './components/Notifications';
import Auth from './components/Auth';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Services
import { checkWateringNotifications } from './services/api';

function AppContent() {
  const [notifications, setNotifications] = useState([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    // Vérifier les notifications au démarrage seulement si l'utilisateur est connecté
    if (user) {
      checkNotifications();
      
      // Vérifier les notifications toutes les 30 minutes
      const interval = setInterval(checkNotifications, 30 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const checkNotifications = async () => {
    try {
      const response = await checkWateringNotifications();
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Erreur lors de la vérification des notifications:', error);
    }
  };

  // Non connecté: afficher l'écran d'authentification
  if (!user) {
    return (
      <Router>
        <Auth />
      </Router>
    );
  }

  // Connecté: afficher l'application protégée
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              Plant Care
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">Mes Plantes</Link>
              </li>
              <li className="nav-item">
                <Link to="/add" className="nav-link">Ajouter</Link>
              </li>
              <li className="nav-item">
                <Link to="/history" className="nav-link">Historique</Link>
              </li>
              <li className="nav-item">
                <Link to="/notifications" className="nav-link">
                  Notifications
                  {notifications.length > 0 && (
                    <span className="notification-badge">{notifications.length}</span>
                  )}
                </Link>
              </li>
              <li className="nav-item">
                <div className="user-info">
                  <span>Bonjour, {user?.username}</span>
                  <button onClick={logout} className="logout-button">
                    Déconnexion
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<PlantList />} />
            <Route path="/add" element={<AddPlant />} />
            <Route path="/plant/:id" element={<PlantDetail />} />
            <Route path="/history" element={<WateringHistory />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
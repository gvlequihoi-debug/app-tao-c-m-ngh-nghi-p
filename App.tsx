
import React, { useState } from 'react';
import MainApp from './components/MainApp';
import LoginScreen from './components/LoginScreen';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-indigo-950 text-gray-200 transition-colors duration-300">
      {isLoggedIn ? <MainApp /> : <LoginScreen onLogin={handleLogin} />}
    </div>
  );
};

export default App;

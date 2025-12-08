
import React from 'react';
import MainApp from './components/MainApp';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-sky-100 dark:bg-sky-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <MainApp />
    </div>
  );
};

export default App;

import React from 'react';
import AppRouter from './router/Router'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

const App = () => {
  return (
    
    <div className="app-container">

      <AppRouter />

      <footer>

      </footer>
    </div>
  );
};

export default App;
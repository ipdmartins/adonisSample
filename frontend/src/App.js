import React, { Component } from 'react';
import './Global.css';
import Routes from './routes';
import Header from './components/Header';

function App() {
  return (
    <div className="container">
      <Header title="Registro de produtos" />
      <Routes />
    </div>

  );
}

export default App;

import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import Login from './Components/Login'
import axios from 'axios'
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom'

function App() {
  return (
    
    <div className="App">
      <Login/>
    </div>
  );
}

export default App;

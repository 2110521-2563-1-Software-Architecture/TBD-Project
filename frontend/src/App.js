import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import Login from './Components/Login'
import Login2 from './Components/Login2'
import axios from 'axios'
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom'

function App() {
  return (
    <Router>
    <div className="App">
      <Login/>
      <Login2/>
      
    </div>
    </Router>
  );
}

export default App;

import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import Login from './Components/Login'
import Signup from './Components/Signup'
import axios from 'axios'
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom'
import "antd/dist/antd.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path={'/login'}>
            <Login/>
          </Route>

          <Route path={'/signup'}>
            <Signup/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

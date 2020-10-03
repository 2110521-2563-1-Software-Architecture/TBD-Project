import React from 'react';
import Login from './Components/Login'
import Signup from './Components/Signup'
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom'
import "antd/dist/antd.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path={'/'}>
            <Login/>
          </Route>
          <Route exact path={'/signup'}>
            <Signup/>
          </Route>
        </Switch>
      </div>
    </Router>
    
  );
}

export default App;

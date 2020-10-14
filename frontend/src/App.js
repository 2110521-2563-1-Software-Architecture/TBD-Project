import React from 'react';
import Header from './Components/Header';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Home from './Components/Home';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import "antd/dist/antd.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path={'/'}>
            <Header/>
            {/* <Login/> */}
            <Home/>
          </Route>
          <Route exact path={'/signup'}>
            <Header/>
            <Signup/>
          </Route>
        </Switch>
      </div>
    </Router>
    
  );
}

export default App;

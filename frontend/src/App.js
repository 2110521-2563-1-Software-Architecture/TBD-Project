import React from 'react';
import PageHeader from './Components/Header';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Home from './Components/Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import "antd/dist/antd.css";
import CreatePost from './Components/CreatePost';
import Post from './Components/Post';

function App() {
  return (
    <Router>
      <div className="App">
        <PageHeader />
        <Switch>
          <Route exact path={'/'}>
            <Login />
          </Route>
          <Router exact path={'/home'}>
            <Home />
          </Router>
          <Route exact path={'/signup'}>
            <Signup />
          </Route>
        </Switch>
      </div>
    </Router>

  );
}

export default App;

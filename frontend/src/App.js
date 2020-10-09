import React from 'react';
import Header from './Components/Header';
import Login from './Components/Login'
import Signup from './Components/Signup'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import "antd/dist/antd.css";
import CreatePost from './Components/CreatePost';
import Post from './Components/Post';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path={'/'}>
            <Header/>
            <Login/>
          </Route>
          <Route exact path={'/signup'}>
            <Header/>
            <Signup/>
          </Route>
          <Route exact path={'/createPost'}>
            <Header/>
            <CreatePost/> {/* add parameter username*/}
          </Route>
          <Route exact path={'/post'}>
            <Header/>
            <Post/> {/* add parameter username*/}
          </Route>
        </Switch>
      </div>
    </Router>
    
  );
}

export default App;

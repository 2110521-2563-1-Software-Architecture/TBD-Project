import React, { useState } from 'react';
import PageHeader from './Components/Header';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Home from './Components/Home';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import "antd/dist/antd.css";
import CreatePost from './Components/CreatePost';
import Post from './Components/Post';
import authHeader from './APIs/auth-header';

function App() {

  // const [user, setUser] = useState()

  // useEffect(() => {
  //   const auth_user = authHeader();
  //   if 
  //   setUser(auth_user)
  // }, [])

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <div className="App">
        <PageHeader />
        <Switch>
          <Route exact path={'/home'}>
            {/* {user && user.token ? <Home /> : <Redirect to="/login" />} */}
            <Home />
          </Route>
          {/* <Router exact path={'/home'}>
            <Home />
          </Router> */}
          <Router exact path={'/'}>
            <Login />
          </Router>
          <Router exact path={'/login'}>
            <Login />
          </Router>
          <Route exact path={'/signup'}>
            <Signup />
          </Route>
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </div>
    </Router>

  );
}

export default App;

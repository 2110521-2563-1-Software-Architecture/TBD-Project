import { Form, Input, Button, Checkbox } from "antd";
import React from 'react';
import UserService from '../APIs/user.service';
import { BrowserRouter as Router, useHistory } from "react-router-dom";

function LogOut() {
  const history = useHistory();
  const clickLogout = () => {

    const header = {
      headers: {
        User: JSON.parse(localStorage.getItem('user')).token
      }
    };

    UserService.logout().then((res) => {
      if (res.data.status == 'success.') {
        localStorage.clear();
        history.push('/');
      }
      else {
        alert(res.data.status)
      }
    });

  }
  return (
    <div>
      {localStorage.getItem('token')
        ? <Button onClick={() => clickLogout()}>
          Logout
            </Button>
        : null}
    </div>
  );
}
export default LogOut;
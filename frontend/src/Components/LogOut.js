import { Form, Input, Button, Checkbox } from "antd";
import React from 'react'
import { BrowserRouter as Router, useHistory } from "react-router-dom";

function LogOut() {
    const history = useHistory();
    const clickLogout = () => {
        localStorage.clear();
        history.push('/');
        console.log('log out');
    }
    return(
        <div>
            {localStorage.getItem('token') 
            ?<Button onClick={()=>clickLogout()}>
                Logout
            </Button>
            :null}
        </div>
    ); 
}
export default LogOut;
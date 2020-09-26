import React, {useState} from 'react'
import axios from 'axios'
import {Link, BrowserRouter as Router} from 'react-router-dom'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    const onChangeUsername = (e) =>{
        setUsername(e.target.value)
    }
    const onChangePassword = (e) =>{
        setPassword(e.target.value)
    }

    const onSubmit = (e) =>{
        e.preventDefault();
        console.log(`login successfully`);
        if(username.includes("@")){
            const sendToBackend = {
                username: username,
                password: password
            }
            setShowMessage(false)
            axios.post('http://localhost:4000/signup', sendToBackend).then(res => console.log(res.data));
        }
        else{
            setShowMessage(true)
        }
        setUsername('');
        setPassword('');
    }
    return (
        <Router>
        <div>
            <div style={title}>
                <p>facebook</p>
            </div>
            <br/><br/><br/><br/>
            <div style={loginZone}>
                <h2>Facebook Login</h2>
                <hr/><br/>
                <div style={form}>
                    <form onSubmit={onSubmit}>
                        <label><span>Email &emsp;: </span></label>
                        <input type='text'
                               value={username}
                               onChange={onChangeUsername}/>
                        <br/><br/>
                        <label>Password : </label>
                        <input type='password'
                               value={password}
                               onChange={onChangePassword}/>
                        <br/><br/>
                        <button style={button}>Login</button>
                        &nbsp; or <Link to="/signup">Sign Up</Link> for free
                    </form>
                    {showMessage && <p style={{color:"red"}}>invalid email pattern!!</p>}
                </div>
            </div>
                /////////////////////////

                อยากให้แก้ตรงไหนบอกนะ อย่าแก้ tag title ใน index.html ล่ะ5555

                //////////////////////////
        </div>
        </Router>
    )
}
const title = {
    fontSize : "40px",
    fontWeight : 'bold',
    color : 'white',
    backgroundColor : 'red',
    border: "red solid",
    width: '100%',
    height: '100px',
    paddingLeft: '20px',
    paddingBottom: '5px'
}
const loginZone = {
    margin: 'auto',
    width: '50%',
    padding: '20px',
    paddingBottom: '80px',
    border: 'gray solid 2px'
}
const form = {
    margin: 'auto',
    width: 'fit-content',
}
const button = {
    color: "white",
    background: "red",
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    cursor: "pointer"
}
export default Login

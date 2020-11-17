import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { Link, BrowserRouter as Router, useHistory } from "react-router-dom";
import UserService from '../APIs/user.service';

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const onFinish = (values) => {
    console.log("Success:", values);
    onSubmit();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const onSubmit = () => {

    if (validateEmail(username)) {

      const sendToBackend = {
        account_id: username,
        pwd: password,
      };

      UserService.login(sendToBackend).then((res) => {
        if (res.data.status == 'success.') {
          const user = { user_id: res.data.user.user_id, token: res.data.user.token }
          localStorage.setItem('user', JSON.stringify(user));
          console.log('user', user);
          window.location.replace("/home");
        }
        else {
          alert(res.data.status)
        }
      })


    } else {
      alert("It's not an email!")
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user)
      window.location.replace("/home");

  }, [])

  return (
    <div>
      <div style={LoginZone}>
        <h2>Fookbace Login</h2>
        <hr />
        <Form
          {...layout}
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onSubmit={onSubmit}
        >
          <Form.Item
            label="Email"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input onChange={onChangeUsername} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password onChange={onChangePassword} />
          </Form.Item>

          <Form.Item {...tailLayout} name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
        <p style={{ textAlign: "center" }}>
          or <Link to="/signup">Sign Up</Link> for free life-time account
        </p>
      </div>
    </div>
  );
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const LoginZone = {
  border: "gray solid 2px",
  width: "50%",
  margin: "auto",
  padding: "20px",
  marginTop: "50px"
};
export default Login;

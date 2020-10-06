import React, { useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { Link, BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import jwt from "jsonwebtoken";
import sha512 from '../middleWare/sha512';
import "antd/dist/antd.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
    // e.preventDefault();
    // console.log(`login successfully`);
    const SECRET = "secret"; // ให้เหมือนของ backend
    const payload = { a: "a" }; // ยังไม่รู้จะใส่อะไร
    const token = jwt.sign(payload, SECRET, { algorithm: "HS256" });
    if (username.includes("@")) {
      const hashedPassword = sha512(password,'check').passwordHash; // hash by sha512 algorithm
      const sendToBackend = {
        account_id: username,
        pwd: hashedPassword, // อย่าลืม hash ก่อนส่ง
      };

      axios
        .post("http://localhost:8080/login", sendToBackend, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
            console.log(res.data);
            localStorage.setItem('token', res.data.token);
            localStorage.getItem('token');
        });
    } else {
    }
    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <div style={LoginZone}>
        <h2>Fookbace Login</h2>
        <hr />
        <br />
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

import React, {useState} from 'react'
import axios from 'axios'
import {Link, BrowserRouter as Router} from 'react-router-dom'
import { Layout, Select, Row, Col, Input, Button } from 'antd';
import Grid from 'antd/lib/card/Grid';
const { Option } = Select;

function Register() {
    const [firstName, setFirstName] = useState('');
    const [surName, setSurName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [date, setDate] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [gender, setGender] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    const onChangeFirstname = (e) =>{
        setFirstName(e.target.value);
    }
    const onChangeSurname = (e) =>{
        setSurName(e.target.value)
    }
    const onChangeEmail = (e) =>{
        setEmail(e.target.value)
    }
    const onChangePassword = (e) =>{
        setPassword(e.target.value)
    }
    const onChangeDate = (e) =>{
        setDate(e.target.value);
        console.log(date);
    }
    const onChangeMonth = (e) =>{
        setMonth(e.target.value)
    }
    const onChangeYear = (e) =>{
        setYear(e.target.value)
    }
    const onChangeGender = (e) =>{
        setGender(e.target.value)
    }

    const onSubmit = () =>{
        
    }
    return (
        <div style={page}>
            <Row className="head">
                <Col span={24} style={topic}>
                    Sign Up
                </Col>
                <Col style={title}>
                    It's quick and easy.
                </Col>
            </Row>
            <Row style={{borderTop: '1px solid #E5E5E5', marginTop:"15px", paddingTop:"15px"}} gutter={10}>
                <Col span={12}>
                    <Input 
                        style={input}
                        onChange={onChangeFirstname}
                        placeholder="First name"
                    />
                </Col>
                <Col span={12}>
                    <Input 
                        style={input}
                        onChange={onChangeSurname}
                        placeholder="Surname"
                    />
                </Col>
            </Row>
            <Row style={{marginTop:"10px"}}>
                <Input 
                    style={input}
                    onChange={onChangeEmail}
                    placeholder="Mobile number or email address"                       
                />
            </Row>
            <Row style={{marginTop:"10px"}}>
                <Input 
                    style={input}
                    onChange={onChangePassword}
                    placeholder="New password"                       
                />
            </Row>
            <Row style={{marginTop:"10px"}} gutter={10}>
                <Col span={24}>Date of birth</Col>
                <Col span={8}>
                    <Select
                        style={select} 
                        defaultValue="1"
                        onChange={e => {
                            onChangeDate(e);
                    }}>
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                        <Option value="4">4</Option>
                        <Option value="5">5</Option>
                        <Option value="6">6</Option>
                        <Option value="7">7</Option>
                        <Option value="8">8</Option>
                        <Option value="9">9</Option>
                        <Option value="10">10</Option>
                        <Option value="11">11</Option>
                        <Option value="12">12</Option>
                        <Option value="13">13</Option>
                        <Option value="14">14</Option>
                        <Option value="15">15</Option>
                        <Option value="16">16</Option> 
                        <Option value="17">17</Option>
                        <Option value="18">18</Option>
                        <Option value="19">19</Option>
                        <Option value="20">20</Option>
                        <Option value="21">21</Option>
                        <Option value="22">22</Option>
                        <Option value="23">23</Option>
                        <Option value="24">24</Option>
                        <Option value="25">25</Option>
                        <Option value="26">26</Option>
                        <Option value="27">27</Option>
                        <Option value="28">28</Option>
                        <Option value="29">29</Option>
                        <Option value="30">30</Option>
                        <Option value="31">31</Option>
                    </Select>
                </Col>
                <Col span={8}> 
                    <Select 
                        style={select}
                        defaultValue="1"
                        onChange={e => {
                            onChangeMonth(e);
                    }}>
                        <Option value="1">Jan</Option>
                        <Option value="2">Feb</Option>
                        <Option value="3">Mar</Option>
                        <Option value="4">Apr</Option>
                        <Option value="5">May</Option>
                        <Option value="6">Jun</Option>
                        <Option value="7">Jul</Option>
                        <Option value="8">Aug</Option>
                        <Option value="9">Sep</Option>
                        <Option value="10">Oct</Option>
                        <Option value="11">Nov</Option>
                        <Option value="12">Dec</Option>  
                    </Select>
                </Col>
                <Col span={8}>
                    <Select 
                        style={select}
                        defaultValue="1"
                        onChange={e => {
                            onChangeYear(e);
                    }}>
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                        <Option value="4">4</Option>
                        <Option value="5">5</Option>
                        <Option value="6">6</Option>
                        <Option value="7">7</Option>
                        <Option value="8">8</Option>
                        <Option value="9">9</Option>
                        <Option value="10">10</Option>
                        <Option value="11">11</Option>
                        <Option value="12">12</Option>
                        <Option value="13">13</Option>
                        <Option value="14">14</Option>
                        <Option value="15">15</Option>
                        <Option value="16">16</Option> 
                        <Option value="17">17</Option>
                        <Option value="18">18</Option>
                        <Option value="19">19</Option>
                        <Option value="20">20</Option>
                        <Option value="21">21</Option>
                        <Option value="22">22</Option>
                        <Option value="23">23</Option>
                        <Option value="24">24</Option>
                        <Option value="25">25</Option>
                        <Option value="26">26</Option>
                        <Option value="27">27</Option>
                        <Option value="28">28</Option>
                        <Option value="29">29</Option>
                        <Option value="30">30</Option>
                        <Option value="31">31</Option>
                    </Select>
                </Col>
            </Row>
            <Row style={{marginTop:"10px"}}>
                <Col span={24}>Gender</Col>
                <Col span={8}>Female</Col>
                <Col span={8}>Male</Col>
                <Col span={8}>Custom</Col>
            </Row>
            <Row style={down}>
By clicking Sign Up, you agree to our Terms, Data Policy and Cookie Policy. You may receive SMS notifications from us and can opt out at any time.
            </Row>
            <Row justify="center">
                <Button 
                    onClick={()=>onSubmit()}
                    style={button_sign_up}
                >
                    Sign Up
                </Button>
            </Row>
        </div>
    )
    
}
const page = {
    margin: 'auto',
    width: "25%",
    border: 'gray solid 2px',
    padding: '15px',
}
const down = {
    color: "#777",
    fontSize: "11px",
    marginTop: "10px",
    marginBottom: "10px"
}
const input = {
    width: "100%",
    borderColor: "#ccd0d5",
    background: "#F4F4F4",
    border:"none",
    borderRadius:"5px",
    padding:"11px"
}
const button_sign_up = {
    height: "36px",
    backgroundColor: "#00a400",
    border: "none",
    borderRadius: "6px",
    paddingLeft: "50px",
    paddingRight: "50px",
    color: "#fff",
    fontSize: "18px",
}
const topic = {
    color: "#1c1e21",
    fontSize: "32px",
    lineHeight: "38px",
    marginBottom: "0"

}
const title = {
    color: "#606770",
    fontSize: "15px",
    lineHeight: "24px"
}
const select = {
    width:"100%"
}

export default Register

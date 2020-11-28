import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useHistory} from 'react-router-dom';
import { Radio, Select, Row, Col, Input, Button, message, Form } from 'antd';
const { Option } = Select;

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

function Signup() {
    const [firstName, setFirstName] = useState('');
    const [surName, setSurName] = useState('');
    const [account_id, setAccountId] = useState('');
    const [password, setPassword] = useState('');
    const [date, setDate] = useState('1');
    const [month, setMonth] = useState('Jan');
    const [year, setYear] = useState('2020');
    const [gender, setGender] = useState('');
    const [pronoun, setPronoun] = useState('');
    const [visPronoun, setVisPronoun] = useState('');
    const [isCustom, setIsCustom] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const history = useHistory();
    const dropdown_day = [];
    const dropdown_year = [];
    const onChangeFirstname = (e) =>{
        setFirstName(e.target.value);
    }
    const onChangeSurname = (e) =>{
        setSurName(e.target.value)
    }
    const onChangeAccountId = (e) =>{
        setAccountId(e.target.value)
    }
    const onChangePassword = (e) =>{
        setPassword(e.target.value)
    }
    const onChangeGender = (e) =>{
        const state = e.target.value;
        if(state==1){
            setGender('Female')
            setIsCustom(false);
        }
        if(state==2){
            setGender('Male')
            setIsCustom(false);
        }
        if(state==3){
            setGender('');
            setIsCustom(true);
        }
    }
    const onChangeVisPronoun = (e) =>{
        setVisPronoun(e.target.value)
    }
    const Dropdown_day = () =>{
        for(var i=1;i<=31;i++){
           dropdown_day.push(i);
        }
    }
    const Dropdown_year = () =>{
        for(var i=2020;i>=1906;--i){
           dropdown_year.push(i);
        }
    }
    Dropdown_day();
    Dropdown_year();
    const checkResult = (status) => {
        if(status === 'already registered.'){
            message.error('This email is already registered.');
        }else {
            message.success('register success');
            history.push(`/`);
        }
    }
    const onSubmit = () =>{
        if(firstName && surName && password && date && month && year && (gender || pronoun)){
            if(validateEmail(account_id)){
                const sendToBackend = {
                    account_id: account_id,
                    pwd: password,
                    first_name: firstName,
                    last_name: surName,
                    gender: gender,
                    birth_date: date+'/'+month+'/'+year
                };
                axios.post('http://localhost:8080/register', sendToBackend)
                    .then(res => {
                        const status = res.data.status;
                        // console.log(status);
                        checkResult(status);
                    });
                
            }
            else{
                message.error('Please check your email format');
            }
            
        } else{
            message.error('Please choose gender or custom');
        }
    }
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if(user) 
        window.location.replace("/home");
      
      }, [])

    return (
        <div>
            <div style={page}>
            <Form
                name="register"
                onFinish={onSubmit}
            >
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
                        <Form.Item
                            name="firstname"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your frist name!",
                                },
                            ]}
                        >
                            <Input 
                                onChange={onChangeFirstname}
                                placeholder="First name"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="surname"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your surname!",
                                },
                            ]}
                        >    
                            <Input 
                                onChange={onChangeSurname}
                                placeholder="Surname"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{marginTop:"10px"}}>
                    <Col span={24}>
                    <Form.Item
                        name="account_id"
                        rules={[
                            {
                                required: true,
                                message: "Please input your email address!",
                            },
                        ]}
                        >   
                        <Input 
                            onChange={onChangeAccountId}
                            placeholder="Email address"                       
                        />
                    </Form.Item>
                    </Col>
                </Row>
                <Row style={{marginTop:"10px"}}>
                    <Col span={24}>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password!",
                            },
                        ]}
                    >   
                        <Input.Password
                            onChange={onChangePassword}
                            placeholder="New password"                       
                        />
                    </Form.Item>
                    </Col>
                </Row>
                <Row style={{marginTop:"10px"}} gutter={10}>
                    <Col span={24}>Date of birth</Col>
                    <Col span={8}>
                        <Select
                            style={select} 
                            defaultValue="1"
                            onSelect={e => {setDate(e)}}
                        >
                            {dropdown_day.map(i => (
                                <Option value={i}>{i}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={8}> 
                        <Select 
                            style={select}
                            defaultValue="1"
                            onSelect={e => {setMonth(e)}}
                        >
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
                            defaultValue="2020"
                            onSelect={e => {setYear(e)}}
                        >
                            {dropdown_year.map(i=>(
                                <Option value={i}>{i}</Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
                <Radio.Group onChange={onChangeGender} style={{width:"100%"}}>
                    <Row style={{marginTop:"10px"}} align="center">
                        <Col span={8}>
                            <Radio value={1}>Female</Radio>
                        </Col>
                        <Col span={8}>
                            <Radio value={2}>Male</Radio>
                        </Col>
                        <Col span={8}>
                            <Radio value={3}>Custom</Radio>
                        </Col>
                    </Row>
                </Radio.Group>
                {isCustom
                    ? <div>
                        <Row style={{marginTop:"5px"}}>
                            <Select 
                                style={select}
                                defaultValue="Select your pronous"
                                onSelect={e => {setPronoun(e)}}
                            >
                                <Option value='She: "Wish her a happy birthday!"'>She: "Wish her a happy birthday!"</Option>
                                <Option value='He: "Wish him a happy birthday!"'>He: "Wish him a happy birthday!"</Option>
                                <Option value='they: "Wish them a happy birthday!"'>they: "Wish them a happy birthday!"</Option> 
                            </Select>
                        </Row>
                        <Row style={down,{fontSize:"12px",color:"#606770", marginTop:"3px", marginBottom:"3px"}}>
                            Your pronoun is visible to everyone.
                        </Row>
                        <Row>
                            <Input 
                                onChange={onChangeVisPronoun}
                                placeholder="Gender (Optional)"
                            />
                        </Row>
                    </div>
                    : null}
                <Row style={down}>
    By clicking Sign Up, you agree to our Terms, Data Policy and Cookie Policy. You may receive SMS notifications from us and can opt out at any time.
                </Row>
                <Row justify="center">
                    <Button 
                        htmlType="submit"
                        type="primary"
                        
                    >
                        Sign Up
                    </Button>
                </Row>
            </Form>
            </div>
        </div>
    )
    
}
const page = {
    margin: 'auto',
    marginTop: "50px",
    width: "30%",
    border: 'gray solid 2px',
    padding: '15px',
}
const down = {
    color: "#777",
    fontSize: "11px",
    marginTop: "10px",
    marginBottom: "10px"
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

export default Signup

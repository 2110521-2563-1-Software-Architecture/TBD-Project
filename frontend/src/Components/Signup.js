import React, {useState} from 'react';
import axios from 'axios';
import {Link, useHistory} from 'react-router-dom';
import { Radio, Select, Row, Col, Input, Button, message } from 'antd';
import jwt from 'jsonwebtoken';
import passwordHash from 'password-hash'
const { Option } = Select;

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
            // history.push(`/${lang}/buy/search`);
        }
    }
    const onSubmit = (e) =>{
        e.preventDefault();
        const SECRET = 'secret'; // ให้เหมือนของ backend
        const payload = {a:'a'}; // ยังไม่รู้จะใส่อะไร
        const token = jwt.sign(payload, SECRET, { algorithm: 'HS256'});
        const password_hash = passwordHash.generate(password);
        if(firstName && surName && account_id && password && date && month && year && (gender || pronoun)){
            const sendToBackend = {
                account_id: account_id,
                pwd: password_hash,
                first_name: firstName,
                last_name: surName,
                gender: gender,
                birth_date: date+'/'+month+'/'+year
            };
            const header = {
                headers:{
                    Authorization: token
                }
            }
            axios.post('http://localhost:8080/register', sendToBackend, header)
                .then(res => {
                    const status = res.data.status;
                    // console.log(status);
                    checkResult(status);
                });
        }
        else{
            message.error('check mendatory');
            console.log('bad some field');
            // console.log('pwd hash: ', password_hash);
            // console.log('firstname: ',firstName);
            // console.log('surname: ',surName);
            // console.log('account_id: ',account_id);
            // console.log('password: ',password);
            // console.log('date: ',date);
            // console.log('month: ',month);
            // console.log('year: ',year);
            // console.log('gender: ',gender);
            // console.log('pronoun: ',pronoun);
        }
    }
    return (
        <div>
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
                            onChange={onChangeFirstname}
                            placeholder="First name"
                        />
                    </Col>
                    <Col span={12}>
                        <Input 
                            onChange={onChangeSurname}
                            placeholder="Surname"
                        />
                    </Col>
                </Row>
                <Row style={{marginTop:"10px"}}>
                    <Input 
                        onChange={onChangeAccountId}
                        placeholder="Mobile number or account_id address"                       
                    />
                </Row>
                <Row style={{marginTop:"10px"}}>
                    <Input.Password
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
                        onClick={onSubmit}
                        style={button_sign_up}
                    >
                        Sign Up
                    </Button>
                </Row>
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

export default Signup

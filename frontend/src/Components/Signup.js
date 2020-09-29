import React, {useState} from 'react';
import axios from 'axios';
import {Link, BrowserRouter as Router} from 'react-router-dom';
import { Radio, Select, Row, Col, Input, Button } from 'antd';
import jwt from 'jsonwebtoken';
import sha512 from '../MiddleWare/sha512';
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

    const onSubmit = (e) =>{
        e.preventDefault();
        const SECRET = 'secret'; // ให้เหมือนของ backend
        const payload = {a:'a'}; // ยังไม่รู้จะใส่อะไร
        const token = jwt.sign(payload, SECRET, { algorithm: 'HS256'});
        const password_hash = sha512(password,'check').passwordHash; // hash by sha512 algorithm
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
                .then(res => console.log('success'));
        }
        else{
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
            <div style={head}>
                    <p>facebook</p>
            </div>
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
                        onChange={onChangeAccountId}
                        placeholder="Mobile number or account_id address"                       
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
                            onSelect={e => {setDate(e)}}
                        >
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
                            <Option value='2020'>2020</Option>
                            <Option value='2019'>2019</Option>
                            <Option value='2018'>2018</Option>
                            <Option value='2017'>2017</Option>
                            <Option value='2016'>2016</Option>
                            <Option value='2015'>2015</Option>
                            <Option value='2014'>2014</Option>
                            <Option value='2013'>2013</Option>
                            <Option value='2012'>2012</Option>
                            <Option value='2011'>2011</Option>
                            <Option value='2010'>2010</Option>
                            <Option value='2009'>2009</Option>
                            <Option value='2008'>2008</Option>
                            <Option value='2007'>2007</Option>
                            <Option value='2006'>2006</Option>
                            <Option value='2005'>2005</Option>
                            <Option value='2004'>2004</Option>
                            <Option value='2003'>2003</Option>
                            <Option value='2002'>2002</Option>
                            <Option value='2001'>2001</Option>
                            <Option value='2000'>2000</Option>
                            <Option value='1999'>1999</Option>
                            <Option value='1998'>1998</Option>
                            <Option value='1997'>1997</Option>
                            <Option value='1996'>1996</Option>
                            <Option value='1995'>1995</Option>
                            <Option value='1994'>1994</Option>
                            <Option value='1993'>1993</Option>
                            <Option value='1992'>1992</Option>
                            <Option value='1991'>1991</Option>
                            <Option value='1990'>1990</Option>
                            <Option value='1989'>1989</Option>
                            <Option value='1988'>1988</Option>
                            <Option value='1987'>1987</Option>
                            <Option value='1986'>1986</Option>
                            <Option value='1985'>1985</Option>
                            <Option value='1984'>1984</Option>
                            <Option value='1983'>1983</Option>
                            <Option value='1982'>1982</Option>
                            <Option value='1981'>1981</Option>
                            <Option value='1980'>1980</Option>
                            <Option value='1979'>1979</Option>
                            <Option value='1978'>1978</Option>
                            <Option value='1977'>1977</Option>
                            <Option value='1976'>1976</Option>
                            <Option value='1975'>1975</Option>
                            <Option value='1974'>1974</Option>
                            <Option value='1973'>1973</Option>
                            <Option value='1972'>1972</Option>
                            <Option value='1971'>1971</Option>
                            <Option value='1970'>1970</Option>
                            <Option value='1969'>1969</Option>
                            <Option value='1968'>1968</Option>
                            <Option value='1967'>1967</Option>
                            <Option value='1966'>1966</Option>
                            <Option value='1965'>1965</Option>
                            <Option value='1964'>1964</Option>
                            <Option value='1963'>1963</Option>
                            <Option value='1962'>1962</Option>
                            <Option value='1961'>1961</Option>
                            <Option value='1960'>1960</Option>
                            <Option value='1959'>1959</Option>
                            <Option value='1958'>1958</Option>
                            <Option value='1957'>1957</Option>
                            <Option value='1956'>1956</Option>
                            <Option value='1955'>1955</Option>
                            <Option value='1954'>1954</Option>
                            <Option value='1953'>1953</Option>
                            <Option value='1952'>1952</Option>
                            <Option value='1951'>1951</Option>
                            <Option value='1950'>1950</Option>
                            <Option value='1949'>1949</Option>
                            <Option value='1948'>1948</Option>
                            <Option value='1947'>1947</Option>
                            <Option value='1946'>1946</Option>
                            <Option value='1945'>1945</Option>
                            <Option value='1944'>1944</Option>
                            <Option value='1943'>1943</Option>
                            <Option value='1942'>1942</Option>
                            <Option value='1941'>1941</Option>
                            <Option value='1940'>1940</Option>
                            <Option value='1939'>1939</Option>
                            <Option value='1938'>1938</Option>
                            <Option value='1937'>1937</Option>
                            <Option value='1936'>1936</Option>
                            <Option value='1935'>1935</Option>
                            <Option value='1934'>1934</Option>
                            <Option value='1933'>1933</Option>
                            <Option value='1932'>1932</Option>
                            <Option value='1931'>1931</Option>
                            <Option value='1930'>1930</Option>
                            <Option value='1929'>1929</Option>
                            <Option value='1928'>1928</Option>
                            <Option value='1927'>1927</Option>
                            <Option value='1926'>1926</Option>
                            <Option value='1925'>1925</Option>
                            <Option value='1924'>1924</Option>
                            <Option value='1923'>1923</Option>
                            <Option value='1922'>1922</Option>
                            <Option value='1921'>1921</Option>
                            <Option value='1920'>1920</Option>
                            <Option value='1919'>1919</Option>
                            <Option value='1918'>1918</Option>
                            <Option value='1917'>1917</Option>
                            <Option value='1916'>1916</Option>
                            <Option value='1915'>1915</Option>
                            <Option value='1914'>1914</Option>
                            <Option value='1913'>1913</Option>
                            <Option value='1912'>1912</Option>
                            <Option value='1911'>1911</Option>
                            <Option value='1910'>1910</Option>
                            <Option value='1909'>1909</Option>
                            <Option value='1908'>1908</Option>
                            <Option value='1907'>1907</Option>
                            <Option value='1906'>1906</Option>
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
                                style={input}
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
const head = {
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
const select = {
    width:"100%"
}

export default Signup

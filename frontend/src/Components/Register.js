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
        <></>
    )
    
}

export default Register

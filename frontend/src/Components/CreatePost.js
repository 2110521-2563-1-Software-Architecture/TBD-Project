import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useHistory} from 'react-router-dom';
import { Radio, Select, Row, Col, Input, Button, message, Form, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import jwt from 'jsonwebtoken';
import user_Image from '../Pictures/user.png';

function CreatePost() {
    const [username,setUsername] = useState('');
    const [text,setText] = useState('');
    const [photo,setPhoto] = useState([]);

    useEffect(() => {
        console.log('photo: ',photo);
    }, [photo]);

    const onChangeText = (newText) => {
        setText(newText.target.value);
    }
    const handleImageChange = (e) => {
        e.preventDefault();
        let files = Array.from(e.target.files);
        files.forEach((file) => {
            let reader = new FileReader();
            reader.onloadend = () => {
              setPhoto({    
                    files: [file], 
                    src: [reader.result]
                });
            };
            reader.readAsDataURL(file);
        });
    }
    
    return(
        <div style={prePostField}>
            <Row>
                <Col span={2}>
                    <img src={user_Image} style={userImage} />
                </Col>
                <Col span={1}></Col>
                <Col span={21}>
                    <input 
                        style={prePostImage}
                        placeholder="What are you thinking?"
                        disabled
                        // onClick={}
                    >
                    </input>
                </Col>
            </Row>
            <Row>
                <input type="file" accept="image/" onChange={handleImageChange} />
                {/* <Upload></Upload> */}
            </Row>
        </div>
    );

}

const prePostField = {
    margin: 'auto',
    marginTop: "50px",
    width: "30%",
    border: 'gray solid 2px',
    padding: '10px',
};
const userImage = {
    maxWidth: "30px",
    maxHight: "30px"
};
const prePostImage = {
    cursor: "pointer",
    width: "100%",
    borderRadius: "15px",
    border: '0px',
    paddingLeft: "20px"
};

export default CreatePost;
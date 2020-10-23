import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useHistory} from 'react-router-dom';
import { Modal, Row, Col, Input, Button, message, Form, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import jwt from 'jsonwebtoken';
import user_Image from '../picture/user.png';
import close_icon2 from '../picture/closeIcon2.png';
import upload_icon from '../picture/upload.png';

function Post(props) {
    const [username,setUsername] = useState(props.content);
    const [text,setText] = useState('aaaaaaaaaaaaaaa');

    const deletePost = () => {
        //TODO add function delete post
    }

    return(
        <div style={PostField}>
            <Row style={{justifyContent: 'space-between'}}>
                <Col>
                    {/* TODO get user image */}
                    <img src={user_Image} style={userImage} />
                    {username}
                </Col>
                <Col >
                    <Button onClick={()=>deletePost()} style={{border:'0px'}}>
                        <img style={closeButton} src={close_icon2}/>
                    </Button>  
                </Col>
            </Row>
            <Row style={{marginTop: '10px'}} >
                {text}
            </Row>
        </div>
    );
}
const PostField = {
    margin: 'auto',
    marginTop: "15px",
    width: "80%",
    border: 'gray solid 2px',
    borderRadius: '10px',
    padding: '15px'
};
const userImage = {
    maxWidth: "30px",
    maxHight: "30px",
    marginRight:'10px'
};
const closeButton = {
    width:'25px'
}
export default Post;
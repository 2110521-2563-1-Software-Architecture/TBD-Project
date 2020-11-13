import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { Modal, Row, Col, Input, Button, message, Form, Upload, Avatar } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import user_Image from '../picture/user.png';
import close_icon2 from '../picture/closeIcon2.png';
import upload_icon from '../picture/upload.png';

function Post(props) {
    const [username, setUsername] = useState(props.owner_name);
    const [ownerID, setOwnerID] = useState(props.owner_id);
    const [text, setText] = useState(props.content);
    const [type, setType] = useState(props.type);
    const [feedID, setFeedID] = useState(props.id);

    const deletePost = () => {
        axios.delete('http://localhost:8080/feed', {
            headers: {
                User: localStorage.getItem('token'),
                target: feedID
            }
        })
            .then(response => {
                console.log('feed: ', response.data);
            })
            .catch((error) => {
                console.log('error ' + error);
            });
    }

    return (
        <div style={PostField}>
            <Row style={{ justifyContent: 'space-between' }}>
                <Col>
                    {/* TODO get user image */}
                    {/* <img src={user_Image} style={userImage} /> */}
                    <Avatar style={{ marginRight: '1rem' }} size={32} src={"https://ui-avatars.com/api/?name=" + username + "&size=64"} />
                    {username}
                </Col>
                <Col >
                    <Button onClick={() => deletePost()} style={{ border: '0px' }}>
                        <img style={closeButton} src={close_icon2} />
                    </Button>
                </Col>
            </Row>
            <Row style={{ marginTop: '10px' }} >
                {type == 'text'
                    ? text
                    : <img style={{ width: '100%' }} src={text} />}
            </Row>
        </div>
    );
}
const PostField = {
    margin: 'auto',
    marginTop: "15px",
    width: "100%",
    border: '#f2f2f2 solid 1px',
    borderRadius: '10px',
    padding: '15px'
};
const userImage = {
    maxWidth: "30px",
    maxHight: "30px",
    marginRight: '10px'
};
const closeButton = {
    width: '25px'
}
export default Post;
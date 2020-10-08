import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useHistory} from 'react-router-dom';
import { Modal, Row, Col, Input, Button, message, Form, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import jwt from 'jsonwebtoken';
import user_Image from '../Pictures/user.png';
const { TextArea } = Input;

function CreatePost() {
    const [username,setUsername] = useState('Pau');
    const [text,setText] = useState('');
    const [photo,setPhoto] = useState([]);

    useEffect(() => {
        console.log('photo: ',photo);
        console.log('text: ',text);
    }, [photo,text]);

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
    const clickOpenPopup = () => {
        var modal = document.getElementById("popup");
        modal.style.display = "block";
    }
    const clickClosed = () => {
        var modal = document.getElementById("popup");
        modal.style.display = "none";
    }
    
    class App extends React.Component {
        state = { visible: false };
      
        showModal = () => {
          this.setState({
            visible: true,
          });
        };
      
        handleOk = e => {
          console.log(e);
          this.setState({
            visible: false,
          });
        };
      
        handleCancel = e => {
          console.log(e);
          this.setState({
            visible: false,
          });
        };
      
        render() {
          return (
            <>
              <div style={prePostField}>
                <Row>
                    <Col span={2}>
                        <img src={user_Image} style={userImage} />
                    </Col>
                    <Col span={1}></Col>
                    <Col span={21}>
                        <Button 
                            style={prePostImage}
                            // disabled
                            onClick={this.showModal}
                        >What are you thinking?
                        </Button>
                    </Col>
                </Row>
                <Row style={{marginTop: '10px'}}>
                    <input type="file" accept="image/" onChange={handleImageChange} />
                    {/* <Upload></Upload> */}
                </Row>
            </div>
              <Modal
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[]}
              >
                <Row justify="center">
                    Create post
                </Row>
                <Row style={body}>
                    <Col>
                        <img src={user_Image} style={userImage} />
                    </Col>
                    <Col style={{marginLeft:'5px'}}>
                        {username}
                    </Col>
                </Row>
                <Row style={{marginTop: '10px'}}>
                    <TextArea placeholder="What are you thinking?" onChange={onChangeText} value={text}/>
                </Row>
                <Row justify="center" style={{marginTop:'10px'}}>
                    <Button type="primary" disabled={text===''} block>Post</Button>
                </Row>
              </Modal>
            </>
          );
        }
      }



    return(
        <div>
            <App/>
        </div>
    );
}

const prePostField = {
    margin: 'auto',
    marginTop: "50px",
    width: "30%",
    border: 'gray solid 2px',
    padding: '15px'
};
const postField = {
    margin: 'auto',
    marginTop: "50px",
    width: "30%",
    border: 'gray solid 2px',
    padding: '15px',
    display: 'none',
}
const body = {
    borderTop: '1px solid #E5E5E5',
    paddingTop: '15px',
    marginTop: '15px'
}
const userImage = {
    maxWidth: "30px",
    maxHight: "30px"
};
const prePostImage = {
    width: "100%",
    borderRadius: "15px",
    paddingLeft: "20px"
};
const closed = {
    color: "#aaaaaa",
    float: "right",
    fontSize: "28px",
    fontWeight: "bold",
    cursor: "pointer"
}

export default CreatePost;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { Modal, Row, Col, Input, Button, message, Form, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import PostService from '../APIs/post.service';
import user_Image from '../picture/user.png';
import close_icon from '../picture/closeIcon.png';
import upload_icon from '../picture/upload.png';
import UploadImageService from '../APIs/image.service'
const { TextArea } = Input;

function CreatePost(props) {
    const textBeforeEdit = props.text;
    const { setModalVisible, setNewText, setFeedList, feedList } = props;
    const [ID, setID] = useState(props.id);
    const [isEdit, setIsEdit] = useState(props.isEdit);
    const [owner_name, setOwnerName] = useState(props.firstname);
    const [text, setText] = useState(props.text);
    const [photo, setPhoto] = useState(props.photo);
    const [imgToBeUploaded, setImgToBeUploaded] = useState("");
    const [visible, setVisible] = useState(props.modalVisible);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0)
    const history = useHistory();

    useEffect(() => {
        setVisible(props.modalVisible);
        setOwnerName(props.firstname);
    }, [props.modalVisible, props.firstname])

    const uploadPhoto = () => {
        const uploadButton = document.getElementById('img_upload');
        if (uploadButton)
            uploadButton.click()
    }

    const handleUploadOnchange = e => {
        const file = e.target.files[0];
        if (file) {
            // const img = URL.createObjectURL(file, setIsLoading);
            // setPhoto(img)
            UploadImageService(file, setPhoto, setIsLoading, setUploadProgress);
            // if (img_url) {
            //     console.log(img_url)
            //     setPhoto(img_url)
            //     setText("")
            // }
        }
    }

    const handleImageChange = (e) => {
        // e.preventDefault();
        let files = e.fileList;
        files.forEach((index) => {
            let file = index.originFileObj;
            let reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result);
            };
        });

        setVisible(true);
        setText('');
    }
    const onChangeText = (e) => {
        e.preventDefault();
        setText(e.target.value);
    }
    const deletePhoto = (index) => {
        setPhoto('');
    }
    const MyUploadButton = () => {
        return (
            // <Upload onChange={handleImageChange} >
            //     <Button style={{ border: '0px' }}>
            //         <img src={upload_icon} style={{ width: '35px', marginRight: '10px' }} />
            //         photo
            //     </Button>
            // </Upload>
            <React.Fragment>
                <input type="file" id="img_upload" accept="image/*" hidden onChange={handleUploadOnchange} />
                <Button style={{ width: '100%', marginTop: '0.7rem' }} type="primary" onClick={uploadPhoto}>Image</Button>
                {photo && photo != '' ? <img src={photo} /> : isLoading ? uploadProgress + "%" : null}
            </React.Fragment>
        );
    }
    const submit = () => {
        let content_type;
        let content;
        if (photo.length != 0) {
            content_type = 'image';
            content = photo;
        }
        else {
            content_type = 'text';
            content = text;
        }
        let sendToBackend;

        if (isEdit) {
            setNewText(text);
            sendToBackend = {
                'target': ID,
                'content_type': content_type,
                'content': content
            };
            PostService.updatePost(sendToBackend).then(response => {
                if (response.data.status === 'success.') {
                    setPhoto('');
                    setVisible(false);
                } else {
                    console.log('status post new feed: ', response.data.status);
                }
            }).catch((error) => {
                console.log('error ' + error);
            });
        } else {
            // add new post to first feed
            setFeedList([{ owner_name: owner_name, content: text, content_type: 'text' }, ...feedList]);
            sendToBackend = {
                'content_type': content_type,
                'content': content
            };
            PostService.createPost(sendToBackend).then(response => {
                if (response.data.status === 'success.') {
                    setPhoto('');
                    setPhoto('');
                    setVisible(false);
                } else {
                    console.log('status post new feed: ', response.data.status);
                }
            }).catch((error) => {
                console.log('error ' + error);
            });
        }
    }
    return (
        <div>
            {isEdit == false
                ? <div style={prePostField}>
                    <Row>
                        <Col span={2} align='right'>
                            <img src={user_Image} style={userImage} />
                        </Col>
                        <Col span={1}></Col>
                        <Col span={21}>
                            <Button
                                style={prePostImage}
                                // disabled
                                onClick={() => setVisible(true)}
                            >What are you thinking?
                            </Button>
                        </Col>
                    </Row>
                    {/* <Row style={{ marginTop: '10px' }} justify="center">
                        <MyUploadButton />
                    </Row> */}
                </div>
                : null}
            <Modal
                visible={visible}
                onCancel={() => { setVisible(false); if (isEdit) setModalVisible(false) }}
                footer={null}
            >
                <Row justify="center">
                    Create post
                </Row>
                <Row style={body}>
                    <Col>
                        <img src={user_Image} style={userImage} />
                    </Col>
                    <Col style={{ marginLeft: '5px' }}>
                        {owner_name}
                    </Col>
                </Row>
                <Row style={{ marginTop: '10px' }}>
                    {photo === ''
                        ? <div style={{ width: '100%' }}>
                            <Row>
                                <TextArea
                                    placeholder="What are you thinking?"
                                    onChange={onChangeText}
                                    value={text}
                                    id="textArea"
                                />
                            </Row>
                            <Row justify="center">
                                <MyUploadButton />
                            </Row>
                        </div>
                        : <div style={{ width: '100%' }}>
                            <Button onClick={() => deletePhoto()} style={{ border: '0px' }}>
                                <img style={closeButton} src={close_icon} />
                            </Button>
                            <img src={photo} style={{ width: '100%' }} />
                        </div>
                    }
                </Row>
                <Row justify="center" style={{ marginTop: '10px' }}>
                    {isEdit
                        ? <Button type="primary" disabled={text == textBeforeEdit || photo == textBeforeEdit} block onClick={submit}>
                            Record
                        </Button>
                        : <Button type="primary" disabled={text === '' && photo.length === 0} block onClick={submit}>
                            Post
                        </Button>}
                </Row>
            </Modal>
        </div>
    );
}

//TODO css 
const prePostField = {
    // margin: 'auto',
    // marginTop: "50px",
    width: "100%",
    border: '#3884e1 solid 1px',
    borderRadius: '10px',
    padding: '15px'
};
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
    paddingLeft: "20px",
    textAlign: 'left'
};
const closeButton = {
    position: 'absolute',
    top: '50px',
    right: '-420px',
    width: '40px',
    cursor: 'pointer'
}

export default CreatePost;
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Row, Col, Avatar, Typography, List, Button } from 'antd'
import CreatePost from './CreatePost';
import UserService from '../APIs/user.service';
import FeedService from '../APIs/feed.service';
import Post from './Post';
import FeedList from './FeedList';

const { Title } = Typography;


function Home() {
    const [owner, setOwner] = useState({first_name: '', last_name: ''});
    const [friendsList, setFriendsList] = useState([]);
    const [friendsListIDs, setFriendsListIDs] = useState([]);
    const [allUser, setAllUser] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    if(user === null) window.location.replace("/login");
    
    useEffect(() => {
        UserService.getOwnerUser().then(response => {
            setOwner(response['data']['user_data'])
            console.log(response['data']['user_data'])
        }).catch((error) => {
            console.log('error ' + error);
        });
        UserService.getFriends().then(response => {
            setFriendsList(response['data']['friends'])
            setFriendsListIDs(response['data']['friends'].map(list => { return list.id }))
        }).catch((error) => {
            console.log('error ' + error);
        });
        UserService.getAllUsers().then(response => {
            setAllUser(response['data']['users'])
        }).catch((error) => {
            console.log('error ' + error);
        });
    }, [])

    const addFriend = (user_id, first_name, last_name) => {
        UserService.addFriend(user_id).then(response => {
            if (response['data']['status'] === 'success.') {
                const new_friend = { id: user_id, first_name: first_name, last_name: last_name }
                setFriendsList(prev => [...prev, new_friend])
                setFriendsListIDs(prev => [...prev, user_id])
            }
        }).catch((error) => {
            console.log('error ' + error);
        });
    }

    const removeFriend = (user_id) => {
        UserService.addFriend(user_id).then(response => {
            if (response['data']['status'] === 'success.') {
                const _friendsList = friendsList.filter(item => item.id !== user_id);
                const _friendsListIDs = friendsListIDs.filter(item => item !== user_id)
                setFriendsList(_friendsList);
                setFriendsListIDs(_friendsListIDs);
                console.log("Remove successfully")
            }
        }).catch((error) => {
            console.log('error ' + error);
        });
    }

    return (
        <Row justify="center" style={{ marginTop: '2.5em' }}>
            <Col span={6}>
                <Row justify="center" align="middle">
                    <Col span={24} style={{ textAlign: 'center' }}><Avatar size={128} src={"https://ui-avatars.com/api/?name="+owner.first_name+"+"+owner.last_name+"&background=0D8ABC&color=fff&size=128"} /></Col>
                </Row>
                <Row justify="center" align="middle">
                    <Col span={24} style={{ textAlign: 'center' }}>
                        <Title level={4}>{owner.first_name} { } {owner.last_name}</Title>
                    </Col>
                </Row>
                <Row justify="center" align="middle" >
                    <Col span={16} >
                        <Title level={5}>Friend Lists</Title>
                        <List
                            size="small"
                            itemLayout="horizontal"
                            dataSource={friendsList}
                            renderItem={item => (
                                <List.Item actions={
                                    [<Button type="primary" shape="round" size="small" danger onClick={() => removeFriend(item.id)}>
                                        Remove
                              </Button>]}>
                                    <List.Item.Meta
                                        avatar={<Avatar size={32} src={"https://ui-avatars.com/api/?name=" + item.first_name + "+" + item.last_name + "&background=0D8ABC&color=fff&size=36"} />}
                                        title={<a href="#">{item.first_name + " " + item.last_name}</a>}
                                    />
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            </Col>
            <Col span={8}>
                <FeedList />
            </Col>
            <Col span={6}><Row justify="center" align="middle" >
                <Col span={20}>
                    <Title level={5}>All users</Title>
                    <List
                        size="small"
                        itemLayout="horizontal"
                        dataSource={allUser}
                        renderItem={item => (
                            user && user.user_id !== item.id ?
                                < List.Item actions={
                                    friendsListIDs.indexOf(item.id) < 0 ? [<Button type="primary" shape="round" onClick={() => addFriend(item.id, item.first_name, item.last_name)}>
                                        Add
                                </Button>] : [<Button type="primary" shape="round" onClick={() => removeFriend(item.id)} danger>
                                            Remove
                                </Button>]
                                }>
                                    <List.Item.Meta
                                        avatar={<Avatar size={32} src={"https://ui-avatars.com/api/?name=" + item.first_name + "+" + item.last_name + "&background=0D8ABC&color=fff&size=36"} />}
                                        title={<a href="#">{item.first_name + " " + item.last_name}</a>}
                                    />
                                </List.Item>
                                : null)}
                    />
                </Col>
            </Row></Col>
        </Row>
    )
}

export default Home

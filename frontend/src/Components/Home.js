import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Row, Col, Avatar, Typography, List, Button } from 'antd'
import CreatePost from './CreatePost';
import UserService from '../APIs/user.service';
import Post from './Post';

const { Title } = Typography;

// const FriendList = props => (
//     <tr>
//         <td>{props.list}</td>
//     </tr>
// )
const AllUser = props => (
    <tr>
        <td>{props.list}</td>
    </tr>
)

function Home() {
    const [friendsList, setFriendsList] = useState([]);
    const [allUser, setAllUser] = useState([]);
    const [feedList, setFeedList] = useState([]);

    useEffect(() => {
        UserService.getFriends().then(response => {
            setFriendsList(response['data']['friends'])
        }).catch((error) => {
            console.log('error ' + error);
        });
        axios.get('http://localhost:8080/feed',
            { headers: { User: localStorage.getItem('token') } })
            .then(response => {
                setFeedList(response.data.news_feed);
                console.log('feed: ', response.data);
            })
            .catch((error) => {
                console.log('error ' + error);
            });
        UserService.getAllUsers().then(response => {
            setAllUser(response['data']['users'])
        }).catch((error) => {
            console.log('error ' + error);
        });
    }, [])

    const removeFriend = id => {

    }

    const addFriend = (user_id) => {
        UserService.addFriend(user_id).then(response => {
            console.log(response['data']['status']);
        }).catch((error) => {
            console.log('error ' + error);
        });
    }

    // const Friend = () => {
    //     if (friendsList == undefined || friendsList == []) {
    //         return;
    //     }
    //     return friendsList.map(function (currentlist, i) {
    //         return <FriendList list={currentlist} key={i} />;
    //     })
    // }
    // const User = () => {
    //     return allUser.map(function (currentlist, i) {
    //         return <AllUser list={currentlist} key={i} />;
    //     })
    // }
    const FeedList = () => {
        if (feedList == undefined || feedList == []) {
            return <div>No Feeds</div>;
        }
        return feedList.map(function (currentlist, i) {
            return <Post content={currentlist.content}
                type={currentlist.content_type}
                owner_id={currentlist.owner_id}
                owner_name={currentlist.owner_name}
                id={currentlist.id}
                key={i}
            />;
        })
    }
    return (
        <Row justify="center" style={{ marginTop: '2.5em' }}>
            <Col span={6}>
                <Row justify="center" align="middle">
                    <Col span={24} style={{ textAlign: 'center' }}><Avatar size={128} src="https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff&size=128" /></Col>
                </Row>
                <Row justify="center" align="middle">
                    <Col span={24} style={{ textAlign: 'center' }}> <Title level={4}>John Doe</Title></Col>
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
                                    [<Button type="primary" shape="round" size="small" danger>
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
            <Col span={8}><CreatePost />
                <List
                    dataSource={[]}
                    split={false}
                    renderItem={item => (
                        <List.Item>
                            <Post content={"Test"}
                                type={"text"}
                                owner_id={123}
                                owner_name={"Nick"}
                                id={1}
                                key={1}
                            />
                        </List.Item>
                    )}
                /></Col>
            <Col span={6}><Row justify="center" align="middle" >
                <Col span={20}>
                    <Title level={5}>All users</Title>
                    <List
                        size="small"
                        itemLayout="horizontal"
                        dataSource={allUser}
                        renderItem={item => (
                            <List.Item actions={
                                [<Button type="primary" shape="round" onClick={() => addFriend(item.id)}>
                                    Add
                          </Button>]}>
                                <List.Item.Meta
                                    avatar={<Avatar size={32} src={"https://ui-avatars.com/api/?name=" + item.first_name + "+" + item.last_name + "&background=0D8ABC&color=fff&size=36"} />}
                                    title={<a href="#">{item.first_name + " " + item.last_name}</a>}
                                />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row></Col>
        </Row>
    )
}

export default Home

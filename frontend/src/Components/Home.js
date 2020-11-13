import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Row, Col, Avatar, Typography, List } from 'antd'
import { getAvatar } from '../APIs/avartar.api'
import Default from '../picture/default.png'
import CreatePost from './CreatePost';
import Post from './Post';

const { Title } = Typography;

const FriendList = props => (
    <tr>
        <td>{props.list}</td>
    </tr>
)
const AllUser = props => (
    <tr>
        <td>{props.list}</td>
    </tr>
)

function Home() {
    const [friendsList, setFriendsList] = useState([]);
    const [allUser, setAllUser] = useState([]);
    const [feedList, setFeedList] = useState([]);

    const data = [
        {
            title: 'Friend1',
        },
        {
            title: 'Friend2',
        },
        {
            title: 'Friend3',
        },
        {
            title: 'Friend4',
        },
    ];


    useEffect(() => {
        axios.get('http://localhost:8080/friend',
            { headers: { User: localStorage.getItem('token') } }) // ใส่ User: localStorage.getItem('token') เอา token ที่ได้ตอน login มาใช้
            .then(response => {
                setFriendsList(response.data.friends)
                console.log('friend: ', response.data);
            })
            .catch((error) => {
                console.log('error ' + error); // bad request = ยังไม่มีเพื่อน
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

    }, [])

    const Friend = () => {
        if (friendsList == undefined || friendsList == []) {
            return;
        }
        return friendsList.map(function (currentlist, i) {
            return <FriendList list={currentlist} key={i} />;
        })
    }
    const User = () => {
        return allUser.map(function (currentlist, i) {
            return <AllUser list={currentlist} key={i} />;
        })
    }
    const FeedList = () => {
        if (feedList == undefined || feedList == []) {
            return;
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
                    <Col span={16}>
                        <Title level={5}>Friend Lists</Title>
                        <List
                            size="small"
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar size={16} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                        title={<a href="https://ant.design">{item.title}</a>}
                                    />
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            </Col>
            <Col span={8}><CreatePost /></Col>
            <Col span={6}><Row justify="center" align="middle" >
                <Col span={24}>
                    <Title level={5}>All users</Title>
                    <List
                        size="small"
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar size={16} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                    title={<a href="https://ant.design">{item.title}</a>}
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

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Row, Col, Avatar, Typography, List, Button } from 'antd'
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
    const [user,setUser] = useState({});
    const [friendsList, setFriendsList] = useState([]);
    const [allUser, setAllUser] = useState([]);
    const [feedList, setFeedList] = useState([]);
    const [isFristTime, setIsFristTime] = useState(true);
    const [isLoadUser,setIsLoadUser] = useState(true);
    const [isLoadFriend,setIsLoadFriend] = useState(true);
    const [isLoadFeed,setIsLoadFeed] = useState(true);
    const [isDelete, setIsDelete] = useState(false);
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
        if(isFristTime){
            axios.get('http://localhost:8080/user_data', 
                { headers: { User: localStorage.getItem('token') } })
                .then(response => {
                    setUser(response.data.user_data);
                    console.log('user: ',response.data.user_data);
                    setIsLoadUser(false);
                })
                .catch((error) => {
                    console.log('error (get user) ' + error); 
                    setIsLoadUser(false);
                });        
            axios.get('http://localhost:8080/friend', 
            { headers: { User: localStorage.getItem('token') } }) // ใส่ User: localStorage.getItem('token') เอา token ที่ได้ตอน login มาใช้
            .then(response => {
                setFriendsList(response.data.friends)
                console.log('friend: ',response.data);
                setIsLoadFriend(false);
            })
            .catch((error) => {
                console.log('error (get friend) ' + error); // bad request = ยังไม่มีเพื่อน
                setIsLoadFriend(false);
            }); 
            axios.get('http://localhost:8080/feed', 
                { headers: { User: localStorage.getItem('token') } })
                .then(response => {
                    if(response.data.news_feed.length > 0){
                        setFeedList(response.data.news_feed);
                    }
                    console.log('feed: ',response.data);
                    setIsLoadFeed(false);
                })
                .catch((error) => {
                    console.log('error (get feed) ' + error); 
                    setIsLoadFeed(false);
                });  
            setIsFristTime(false);  
        }else{
            axios.get('http://localhost:8080/feed', 
            { headers: { User: localStorage.getItem('token') } })
            .then(response => {
                setFeedList(response.data.news_feed);
                console.log('fetch feed: ',response.data);
                setIsLoadFeed(false);
            })
            .catch((error) => {
                console.log('error (get feed) ' + error); 
                setIsLoadFeed(false);
            }); 
            setIsDelete(false);
        
        }
                
    }, [isDelete]);

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
            return <div>No Feeds</div>;
        }
        return feedList.map(function(currentlist, i){
            return <Post content={currentlist.content} 
                        type={currentlist.content_type} 
                        owner_id={currentlist.owner_id} 
                        owner_name={currentlist.owner_name}
                        id={currentlist.id}
                        key={i} 
                        setIsDelete={setIsDelete}
                        setIsLoadFeed={setIsLoadFeed}
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
                            dataSource={data}
                            renderItem={item => (
                                <List.Item actions={
                                    [<Button type="primary" shape="round" size="small" danger>
                                        Remove
                              </Button>]}>
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
            <Col span={8}>
                <CreatePost 
                        isEdit={false}
                        modalVisible={false}
                        text={''}
                        photo={''}
                        firstname={user.first_name}
                        setFeedList={setFeedList}
                        feedList={feedList}/>
                <List
                // Post list
                    dataSource={data}
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
                        dataSource={data}
                        renderItem={item => (
                            <List.Item actions={
                                [<Button type="primary" shape="round">
                                    Add
                          </Button>]}>
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

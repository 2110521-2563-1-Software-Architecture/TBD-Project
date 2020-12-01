import React, { useEffect, useState } from 'react';
import useInfiniteScroll from "./UseInfiniteScroll";
import { Row, Col, Avatar, Typography, List, Button, Spin } from 'antd'
import FeedService from '../APIs/feed.service';
import Post from './Post';
import CreatePost from './CreatePost';
import UserService from '../APIs/user.service';

const FeedList = () => {
  const [feedList, setFeedList] = useState([]);
  const [[isFetching, setIsFetching],[isFinish, setIsFinish]] = useInfiniteScroll(fetchMoreListItems);
  const [isFristTime, setIsFristTime] = useState(true);
  const [isLoadUser,setIsLoadUser] = useState(true);
  const [isLoadFriend,setIsLoadFriend] = useState(true);
  const [isLoadFeed,setIsLoadFeed] = useState(true);
  const [isDelete, setIsDelete] = useState(false);
  const [page,setPage] = useState([]);
  const [owner, setOwner] = useState({first_name: '', last_name: ''});
  const user = JSON.parse(localStorage.getItem('user'));

  function getFeedId(){
      const feedID = [];
      for( var feed in feedList ){
        feedID.push(feedList[feed].id)
      }
      return feedID
  }

  function fetchMoreListItems() {
    const new_page = getFeedId();
    setPage(new_page);
    FeedService.getFeed(new_page).then(response => {
        // console.log('Feed', response)
        if(!response.data.news_feed.length){
            setIsFinish(true);
        }
        else{
            // console.log('Feed', response.data.news_feed);
            setFeedList([...feedList, ...response.data.news_feed]);
        }
    }).then(()=>{
        setIsFetching(false);
    })
    .catch((error) => {
        console.log('error ' + error);
    });
  }

  useEffect(() => {
        UserService.getOwnerUser().then(response => {
            setOwner(response['data']['user_data'])
        }).catch((error) => {
            console.log('error ' + error);
        });
        FeedService.getFeed(page).then(response => {
            // console.log('Feed', response.data)
            setFeedList([...feedList, ...response.data.news_feed])
        })
        .catch((error) => {
            console.log('error ' + error);
        });
      
 }, [])

  return (
    <>
        <CreatePost 
                        isEdit={false}
                        modalVisible={false}
                        text={''}
                        photo={''}
                        firstname={owner.first_name+' '+owner.last_name}
                        setFeedList={setFeedList}
                        feedList={feedList}/>
        <List
                    dataSource={feedList}
                    split={false}
                    renderItem={item => (
                        <List.Item>
                            <Post
                                content={item.content}
                                type={item.content_type}
                                owner_id={item.owner_id}
                                user_id={user.user_id}
                                owner_name={item.owner_name}
                                like={item.like}
                                love={item.dislike}
                                isLike={item.isLike}
                                isLove={item.isLove}
                                id={item.id}
                                key={item.id}                                
                            />
                        </List.Item>
                    )}
                />
        <Row justify='center'>
            {isFetching ?<Spin size='large' justify='center'/>:null}
        </Row>
    </>
  );
};

export default FeedList;
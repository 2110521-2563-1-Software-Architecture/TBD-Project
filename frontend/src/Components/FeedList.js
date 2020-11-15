import React, { useEffect, useState } from 'react';
import useInfiniteScroll from "./UseInfiniteScroll";
import { Row, Col, Avatar, Typography, List, Button } from 'antd'
import FeedService from '../APIs/feed.service';
import Post from './Post';
import CreatePost from './CreatePost';

const FeedList = () => {
  const [feedList, setFeedList] = useState([]); //mock data to test scrolling 
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);
  const [isFristTime, setIsFristTime] = useState(true);
  const [isLoadUser,setIsLoadUser] = useState(true);
  const [isLoadFriend,setIsLoadFriend] = useState(true);
  const [isLoadFeed,setIsLoadFeed] = useState(true);
  const [isDelete, setIsDelete] = useState(false);
  const [page,setPage] = useState(1);
  const user = JSON.parse(localStorage.getItem('user'));

  function fetchMoreListItems() {
    const newpage = page + 1;
    setPage(newpage);
    FeedService.getFeed(newpage).then(response => {
        // console.log('Feed', response.data)
        if(!response.data.news_feed.length){
            setPage(newpage - 1);
        }
        else{
            console.log('Feed', response.data.news_feed)
            setFeedList([...feedList, ...response.data.news_feed])
        }
    }).then(()=>{
        setIsFetching(false);
    })
    .catch((error) => {
        console.log('error ' + error);
    });
  }

  useEffect(() => {
        FeedService.getFeed(page).then(response => {
            console.log('Feed', response.data)
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
                        firstname={user.first_name}
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
                                owner_name={item.owner_name}
                                like={item.like}
                                love={item.dislike}
                                id={item.id}
                                key={item.id}
                            />
                        </List.Item>
                    )}
                />
        {/* TODO css while fetching */}
      {isFetching && 'Fetching more list items...'}
    </>
  );
};

export default FeedList;
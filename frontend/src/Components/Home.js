import React from 'react'
import {Row, Col, Table, Tag, Space, Alert } from 'antd'
import Default from '../picture/default.png'

function Home() {
    return (
        <div>
            <Row >
                <Col style={Style} span={6}>
                    <div className="picture_name" style={{width: "90%", margin: "auto"}}>
                        <img src={Default} style={{width:"100%"}}/>
                        My Name is Thanapun(กาก)
                    </div>
                    <div className="FriendList" style={FriendList}>
                        <Table columns={columns} dataSource={data} />
                    </div>
                </Col>
                <Col style={Style} span={12}>
                    ไว้ใส่ contents
                </Col>
                <Col style={Style} span={6}>
                    <div className="All User" style={AllUser}>
                        <Table columns={column} dataSource={dat} />
                    </div>
                </Col>
            </Row>
        </div>
    )
}
/////////////Friend List///////////////////////
const columns = [
    {
      title: 'FriendList',
      dataIndex: 'FriendList',
      key: 'FriendList',
    }
    
]
const data = [
    {
      FriendList: "fffm  kg"
    }
]
//////////////All User////////////////////////
const column = [
    {
      title: 'AllUser',
      dataIndex: 'AllUser',
      key: 'AllUser',
    }
    
]
const dat = [
    {
      AllUser: "fffm  kg"
    }
]
////////////////////////////////////////////////
const Style = {
    border: "solid black"
}
const FriendList = {
    width: "ๅจ0%",
    margin: 'auto'
}
const AllUser = {

}
export default Home

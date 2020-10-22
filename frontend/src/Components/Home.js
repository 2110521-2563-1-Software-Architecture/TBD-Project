import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {Row, Col} from 'antd'
import Default from '../picture/default.png'

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

    useEffect(() => {
        axios.get('http://localhost:4000')
            .then(response => {
                setFriendsList(response.data.friend)
                setAllUser(response.data.user)
            })
            .catch(function (error){
                console.log(error);
            })
    }, [])

    const Friend = () => {
        return friendsList.map(function(currentlist, i){
            return <FriendList list={currentlist} key={i} />;
        })
    }
    const User = () => {
        return allUser.map(function(currentlist, i){
            return <AllUser list={currentlist} key={i} />;
        })
    }
    return (
        <div>
            <Row >
                <Col style={Style} span={6}>
                    <div className="picture_name" style={{width: "90%", margin: "auto"}}>
                        <img src={Default} style={{width:"100%"}}/>
                        My Name is Thanapun(ไม่กากและโหดมาก) <br/>
                        เหลือตรงดึงรูปภาพจาก backend นะ(ตรงนี้) ทำไม่เป็น TT <br/>
                        แล้วก็ฝากตรวจที่ทำไปด้วยนะ ไม่ค่อยเข้าใจเลย TT
                    </div>
                    <div className="FriendList" style={{margin:"auto",width:"90%"}}>
                        <table style={{width:"100%"}}>
                            <tr>
                                <th>Friend List</th>
                            </tr>
                            <tr>
                                {Friend}
                            </tr>
                        </table>
                        
                    </div>
                </Col>
                <Col style={Style} span={12}>
                    ไว้ใส่ contents
                </Col>
                <Col style={Style} span={6}>
                    <div className="All User" style={{margin:"auto",width:"90%"}}>
                        <table style={{width:"100%"}}>
                            <tr>
                                <th>All User</th>
                            </tr>
                            <tr>
                                {User}
                            </tr>
                        </table>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

////////////////////////////////////////////////
const Style = {
    border: "solid black"
}

export default Home

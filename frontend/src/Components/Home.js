import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {Row, Col} from 'antd'
import Default from '../picture/default.png'
import jwt from "jsonwebtoken";

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
        // axios.get('http://localhost:4000')
        //     .then(response => {
        //         setFriendsList(response.data.friend)
        //         setAllUser(response.data.user)
        //     })
        //     .catch(function (error){
        //         console.log(error);
        //     })  
        const SECRET = "secret"; // ให้เหมือนของ backend
        const payload = { a: "a" }; // ยังไม่รู้จะใส่อะไร
        const token = jwt.sign(payload, SECRET, { algorithm: "HS256" });        
        axios.get('http://localhost:8080/friend', 
        { headers: { Authorization: token, User: localStorage.getItem('token') } }) // ใส่ User: localStorage.getItem('token') เอา token ที่ได้ตอน login มาใช้
         .then(response => {
             console.log(response.data); // response.data จะหน้าตาประมาณข้างล่างนี้
            //  [
            //      {
            //         'id': id,
            //         'email': email,
            //         'first_name': first_name,
            //         'last_name': last_name,
            //         'birth_date': birth_date,
            //         'gender': gender
            //     }
            // ]
          })
         .catch((error) => {
             console.log('error ' + error); // bad request = ยังไม่มีเพื่อน
          });            
              
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

import React from 'react'
import ReactDOM from 'react-dom'
import LogOut from './LogOut';
import {Row, Col} from 'antd'

function Header() {
    return(
        <Row style={head}>
                <Col>
                    fookbace
                </Col>
                <Col>
                    <LogOut/>
                </Col>
        </Row>
    );
}
const head = {
    fontSize : "40px",
    fontWeight : 'bold',
    color : 'white',
    backgroundColor : 'red',
    border: "red solid",
    width: '100%',
    paddingTop: "30px",
    paddingLeft: '20px',
    justifyContent: 'space-between'
}
export default Header;
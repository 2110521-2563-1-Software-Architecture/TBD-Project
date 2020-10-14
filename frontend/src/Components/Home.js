import React from 'react'
import {Row, Col} from 'antd'

function Home() {
    return (
        <div>
            <Row >
                <Col style={Style} span={6}>col-6</Col>
                <Col style={Style} span={12}>col-12</Col>
                <Col style={Style} span={6}>col-6</Col>
            </Row>
        </div>
    )
}

const Style = {
    border: "solid black"
}
export default Home

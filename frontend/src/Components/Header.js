import React from 'react'
import { Layout, Menu, Breadcrumb } from 'antd';
import Logo from '../picture/logo_fb.png'
import ReactDOM from 'react-dom'

const { Header, Content, Footer } = Layout;

const PageHeader = () => {
    return (
        <Layout className="layout">
            <Header>
                {/* <div className="logo_fb" /> */}
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['Home']}>
                    <Menu.Item key="Home" style={{ float: 'left' }}><img src={Logo} width={36} height={36} /></Menu.Item>
                    <Menu.Item key="1" style={{ float: 'right' }}>Logout</Menu.Item>
                    <Menu.Item key="2" style={{ float: 'right' }}>Register</Menu.Item>
                    <Menu.Item key="3" style={{ float: 'right' }}>Login</Menu.Item>
                </Menu>
            </Header>
        </Layout>
    );
}
export default PageHeader;
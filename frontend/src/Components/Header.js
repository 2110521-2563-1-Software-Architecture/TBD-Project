import React from 'react'
import { Link } from 'react-router-dom'
import { Layout, Menu, Breadcrumb } from 'antd';
import Logo from '../picture/logo_fb.png'
import ReactDOM from 'react-dom'

const { Header, Content, Footer } = Layout;

const logout = () => {
    localStorage.removeItem("user");
    window.location.replace("/login");
}

const user = JSON.parse(localStorage.getItem('user'));

const PageHeader = () => {

    if (user && user.token)
        return (
            <Layout className="layout">
                <Header>
                    {/* <div className="logo_fb" /> */}
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['Home']}>
                        <Menu.Item key="Home" style={{ float: 'left' }}><img src={Logo} width={36} height={36} /></Menu.Item>
                        <Menu.Item key="1" style={{ float: 'right' }} onClick={logout}>Logout</Menu.Item>
                    </Menu>
                </Header>
            </Layout>
        );
    else
        return (
            <Layout className="layout">
                <Header>
                    {/* <div className="logo_fb" /> */}
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['Home']}>
                        <Menu.Item key="Home" style={{ float: 'left' }}><img src={Logo} width={36} height={36} /></Menu.Item>
                        <Menu.Item key="2" style={{ float: 'right' }}><Link to="/signup">Register</Link></Menu.Item>
                        <Menu.Item key="3" style={{ float: 'right' }}><Link to="/login">Login</Link></Menu.Item>
                    </Menu>
                </Header>
            </Layout >
        );
}
export default PageHeader;
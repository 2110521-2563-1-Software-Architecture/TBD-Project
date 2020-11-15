import React from 'react'
import { Layout, Menu, Breadcrumb } from 'antd';
import ReactDOM from 'react-dom'
import LogOut from './LogOut';
import {Row, Col} from 'antd'

const { Header, Content, Footer } = Layout;

const PageHeader = () => {
    return (
        <Layout className="layout">
            <Header>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    <Menu.Item key="1">nav 1</Menu.Item>
                    <Menu.Item key="2">nav 2</Menu.Item>
                    <Menu.Item key="3">nav 3</Menu.Item>
                </Menu>
            </Header>
        </Layout>
    );
}
export default PageHeader;

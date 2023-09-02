import React, { useState } from 'react';
import { Link, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DoubleRightOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { IoTodayOutline } from 'react-icons/io5';
import { PiGridNineLight } from 'react-icons/pi';
import { Layout, Menu, Button, theme } from 'antd';
import Stickwall from './Stickwall';
import Today from '../Today/index'; // Import the Today comp
import Work from'../Work/index'
import Upcomming from'../Upcomming/index'
import SticksCalendar from'../Calender/index'
import { auth } from '../Config/Config';
import { signOut } from 'firebase/auth';
import Auth from "../Auth/index"
import { useAuthContext } from '../contexts/AuthContext'




const { Header, Sider, Content } = Layout;

const Person = () => <div style={{position:'absolute',top:'45%',left:'45%'}}><h2>Welcome Developers &#128513;</h2></div>;


const Index = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const location = useLocation();



  const { isAuth } = useAuthContext()


    // Add Firebase signout function
    const handleSignOut = async () => {
      console.log('Signout button clicked');
      signOut(auth).then(() => {
       console.log('Signout Sucessfully')

      }).catch((error) => {
        // An error happened.
        console.log('Something went wrong while signout')
      });
    };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <h2 style={{ color: 'yellowgreen', padding: '4px 20px' }}>Work</h2>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
          <Menu.Item key="/upcoming" icon={<DoubleRightOutlined />}>
            <Link to="/upcoming">Upcoming</Link>
          </Menu.Item>
          <Menu.Item key="/today" icon={<IoTodayOutline />}>
            <Link to="/today">Today</Link>
          </Menu.Item>
          <Menu.Item key="/SticksCalendar" icon={<CalendarOutlined />}>
            <Link to="/SticksCalendar">Calendar</Link>
          </Menu.Item>
          <Menu.Item key="/stickwall" icon={<PiGridNineLight />}>
            <Link to="/stickwall">Stick Wall</Link>
          </Menu.Item> 
  
          <h2 style={{ color: 'yellowgreen', padding: '4px 20px' }}>List</h2>
          <Menu.Item key="/work" icon={<DoubleRightOutlined />}>
            <Link to="/work">Work</Link>
          </Menu.Item>
          <Menu.Item key="/person" icon={<IoTodayOutline />}>
            <Link to="/person">Person</Link>
          </Menu.Item>
          <h2 style={{ color: 'yellowgreen', padding: '4px 20px' }}>SignOut</h2>
          <Menu.Item key="/signout" icon={<IoTodayOutline />}>
        {/* Use Navigate component to redirect after signout */}
        <Link to="/signout" onClick={handleSignOut}>Signout
        
        </Link>
      </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <h1 style={{ color: 'white', paddingLeft: '40px' }}>
            {location.pathname.replace('/', '')}
          </h1>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Routes>
            <Route path="/stickwall" element={<Stickwall />} />
            <Route path="/upcoming" element={<Upcomming />} />
            <Route path="/today" element={<Today />} /> {}
            <Route path="/SticksCalendar" element={<SticksCalendar />} />
            <Route path="/person" element={<Person />} />
            <Route path="/work" element={<Work/>} />
            <Route path="/signout" element={<Navigate to="/register"/>} />
            {/* <Route path="/*" element={<Navigate to="/user" />} /> */}
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Index;

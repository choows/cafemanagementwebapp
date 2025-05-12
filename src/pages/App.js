import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cafe from './cafe/Cafe';
import Employee from "./employee/Employee";
import ErrorPage from './error/Error';
import { useState } from 'react';
import {
  UserOutlined,
  BankOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Link } from 'react-router-dom';

const { Content, Footer, Sider } = Layout;

function App() {
 // const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [page, setCurrentPage] = useState('Cafe');

  const getItem = (label, key, icon, children) => {
    return {
      key,
      icon,
      children,
      label
    };
  }
  const items = [
    getItem((<Link to={"/"}>Cafe</Link>), '1', <BankOutlined />),
    getItem((<Link to={"/employee"} state={{id: null}}>Employee</Link>), '2', <UserOutlined />),
  ];
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const getItemFromList = (key) => {
    var found_item = items.filter((item) => {
      return item.key == key;
    });
    return found_item[0];
  }

  const handleOnClick = (val) => {
    var item = getItemFromList(val.key);
    setCurrentPage(item.label);
  }

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
          <div className="demo-logo-vertical" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={handleOnClick} />
        </Sider>
        <Layout>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>{page}</Breadcrumb.Item>
            </Breadcrumb>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Routes>
                <Route path="/" element={<Cafe />} />
                <Route path="/employee" element={<Employee />} />
                <Route path="*" element={<ErrorPage />} />
              </Routes>

            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Cafe Management ©{new Date().getFullYear()} Created by Choows
          </Footer>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

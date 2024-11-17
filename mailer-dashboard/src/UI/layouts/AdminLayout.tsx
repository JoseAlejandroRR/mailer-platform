
import { useState } from 'react'
import { Layout, Menu, Button, theme } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  SendOutlined
} from '@ant-design/icons'
import { Outlet, useNavigate } from 'react-router-dom'

const { Header, Sider, Content } = Layout

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const navigate = useNavigate()

  const goTo = (url: string) => {
    navigate(url)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} breakpoint="lg"
        onBreakpoint={(broken) => {
          setCollapsed(broken)
        }}>
        <div className="demo-logo-vertical" style={{ height: '32px', margin: '16px', background: 'rgba(255,255,255,.2)' }}>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <HomeOutlined />,
              label: 'Dashboard',
              onClick: () => goTo('/')
            },
            {
              key: '2',
              icon: <SendOutlined />,
              label: 'Mailer',
              onClick: () => goTo('/mailer')
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

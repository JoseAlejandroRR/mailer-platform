import React, { useRef, useEffect } from 'react'
import { Card, Row, Col, Typography, Space, Divider, Tag, Tooltip } from 'antd'
import { MailOutlined, ClockCircleOutlined, UserOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { EmailDto } from '../../../data/models/EmailDto'

const { Title, Text } = Typography

type EmailRenderPreviewProps = {
  email: EmailDto
}

const EmailRenderPreview: React.FC<EmailRenderPreviewProps> = ({ email }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
      if (iframeDoc) {
        iframeDoc.open()
        iframeDoc.write(email.body)
        iframeDoc.close()
      }
    }
  }, [email.body])

  return (
    <Card style={{ margin: '0px', borderRadius: '8px' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={4}>
            <MailOutlined /> Email Details
          </Title>
        </Col>

        <Col>
          <Space size="large">
            <Tag color={email.status === 'SENT' ? 'green' : 'default'}>
              {email.status}
            </Tag>
            <Tooltip title={`${new Date(email.createdAt).toLocaleString()}`}>
              <ClockCircleOutlined style={{ fontSize: '16px', cursor: 'pointer' }} />
            </Tooltip>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space direction="vertical" size="small">
            <Text>
              <strong>Subject:</strong> {email.subject}
            </Text>
            <Text>
              <strong>From:</strong> <UserOutlined /> {email.from.email}
            </Text>
            <Text>
              <strong>To:</strong> <UsergroupAddOutlined /> {email.to.map((t) => t.email).join(', ')}
            </Text>
            {email.cc.length > 0 && (
              <Text>
                <strong>CC:</strong>  <UsergroupAddOutlined /> {email.cc.map((c) => c.email).join(', ')}
              </Text>
            )}
          </Space>
        </Col>
      </Row>
      <Divider />
      <iframe
        ref={iframeRef}
        style={{
          width: 'calc(100% - 40px)',
          height: '400px',
          border: '1px solid #ccc',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        title="HTML Renderer"
      />
    </Card>
  )
}

export default EmailRenderPreview

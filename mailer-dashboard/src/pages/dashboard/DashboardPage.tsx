import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Divider, Drawer, Popover, Row, Segmented, Space, Statistic, Table, TableProps, Tag, Tooltip } from 'antd'
import { ClockCircleOutlined, EyeOutlined, LineChartOutlined, WarningOutlined } from '@ant-design/icons'
import useEmails from '../../data/hooks/useEmails'
import { EmailStatus } from '../../data/models/EmailStatus'
import { EmailDto } from '../../data/models/EmailDto'
import { useIsFirstRender } from '../../UI/utils'
import EmailRenderPreview from '../../UI/components/email-preview/EmailRenderPreview'


const emailDataInitial: Record<EmailStatus, EmailDto[]> = {
  [EmailStatus.SENT]: [],
  [EmailStatus.QUEUED]: [],
  [EmailStatus.OPENED]: [],
  [EmailStatus.FAILED]: [],
  [EmailStatus.PENDING]: [],
  [EmailStatus.DELIVERED]: [],
  [EmailStatus.MAX_TRIED]: [],
  [EmailStatus.DRAFT]: [],
}

const DashboardStatus = {
  [EmailStatus.QUEUED]: { title: EmailStatus.QUEUED, color: '#0061b3', status: EmailStatus.QUEUED, icon: <ClockCircleOutlined /> },
  [EmailStatus.SENT]: { title: EmailStatus.SENT, color: '#3f8600', status: EmailStatus.SENT, icon: <ClockCircleOutlined /> },
  [EmailStatus.MAX_TRIED]: { title: 'MAX RETRY', color: '#333', status: EmailStatus.MAX_TRIED, icon: <WarningOutlined />},
  [EmailStatus.FAILED]: { title: EmailStatus.FAILED, color: '#cf1322', status: EmailStatus.FAILED, icon: <WarningOutlined />},
}


const DashboardPage: React.FC = () => {
  const [ currentView, setCurrentView ] = useState<EmailStatus>(EmailStatus.SENT)
  const [ emailData, setEmailData ] = useState(emailDataInitial)
  const { getEmailsByStatus, loading: loadingEmails } = useEmails()
  const [ emailSelected, setEmailSelected ] = useState<EmailDto | null>(null)
  const [ showDetails, setShowDetails ] = useState<boolean>(true)
  const [requestStatus, setRequestStatus] = useState([
    EmailStatus.SENT,
    EmailStatus.QUEUED,
    EmailStatus.FAILED,
    EmailStatus.MAX_TRIED,
  ])

  const istFirstRender = useIsFirstRender()


  useEffect(() => {
    (async () => {
      if (requestStatus.length < 1) return;

      const currentStatus: EmailStatus = requestStatus.shift()!
        const data = await getEmailsByStatus({ status: currentStatus! })
        setEmailData((state) => ({ ...state, [currentStatus]: data.map((item) => ({ ...item, key:item.id})).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()) }))
        setRequestStatus([...requestStatus])
    })()
  }, [requestStatus])


  useEffect(() => {
    if (istFirstRender) return;

    getEmailsByStatus({ status: currentView })
  }, [currentView])

  const handleCurrentView = (option: any) => {
    const panel = Object.values(DashboardStatus).find((item) => item.title === option)
    setCurrentView(panel!.status)
  }

  const handleShowEmail = (email: EmailDto) => {
    setShowDetails(true)
    setEmailSelected(email)
  }

  const columns: TableProps<EmailDto>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id, email) => <>
        <Space>

        <Tooltip title={`${new Date(email.createdAt).toLocaleString()}`}>
          <ClockCircleOutlined style={{ fontSize: '16px', cursor: 'pointer' }} />
        </Tooltip>
        <Tooltip title={id}>
          { id.substring(0, 8) }
        </Tooltip>
        </Space>
      </>,
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject) => <span>{subject}</span>,
    },
    {
      title: 'From',
      dataIndex: 'from',
      key: 'from',
      render: (from) => (
        <>
        <Popover title={from.name} content={
          <>
            { from.email }
          </>
        }>
         <Tag key={from.email}>
            { from.email }
          </Tag>
        </Popover>
        </>
      ),
    },
    {
      title: 'To',
      key: 'to',
      dataIndex: 'to',
      // eslint-disable-next-line no-unused-vars
      render: (_, { to }) => (
        <>
          {to.map((account) => {
            return (
              <Popover title={account.name} content={
                <>
                  { account.email }
                </>
              } key={account.email}>
               <Tag>
                  { account.email }
                </Tag>
              </Popover>
            );
          })}
        </>
      ),
    },
    {
      title: 'CC',
      key: 'cc',
      dataIndex: 'cc',
      // eslint-disable-next-line no-unused-vars
      render: (_, { cc }) => (
        <>
          {cc.map((account) => {
            return (
              <Popover title={account.name} content={
                <>
                  { account.email }
                </>
              } key={account.email}>
               <Tag>
                  { account.email }
                </Tag>
              </Popover>
            );
          })}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      // eslint-disable-next-line no-unused-vars
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={"View"}>
            <Button icon={<EyeOutlined /> } type='text' onClick={() => handleShowEmail(record)} />
          </Tooltip>
          { record.provider && (
            <Popover title={"Tracking"} content={
            <>
              Sent with: { record.provider }
            </>
          }>
            <Button icon={<LineChartOutlined /> } type='text' />
          </Popover>
          )}
        </Space>
      ),
    },
  ]

  const handleLoadMore = async () => {
    const lastEmail = emailData[currentView][emailData[currentView].length-1]

    const data = await getEmailsByStatus({
      status: currentView,
      cursor: {
        status: currentView, cursorId: lastEmail.id, createdAt: lastEmail.createdAt
      }
    })

    const emails = [...emailData[currentView] ,...data.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())]

    setEmailData((state) => ({
      ...state,
      [currentView]: emails.map((item) => ({ ...item, key:item.id}))
    }))
  }

  return (
    <>
      <div className="page-dashboard">
        <Row gutter={20}>
          {
            Object.values(DashboardStatus).map((panel, index) => (
              <Col span={6} key={index}>
                <Card>
                  <Statistic
                    title={panel.title}
                    value={emailData[panel.status].length}
                    valueStyle={{ color: panel.color }}
                    prefix={panel.icon}
                  />
                </Card>
              </Col>
            ))
          }
        </Row>
        <Divider />
        <Segmented value={currentView} options={Object.values(DashboardStatus).map((panel) => panel.title)}
          onChange={handleCurrentView} block />
        <Divider />
        <Table<EmailDto> columns={columns} dataSource={emailData[currentView]}
          loading={loadingEmails} pagination={false}  />
          <Space direction="vertical" style={{ width: '100%', marginTop: '16px', textAlign: 'center' }}>
            <Button type="primary" onClick={handleLoadMore} loading={loadingEmails}>
              Load More
            </Button>
          </Space>
      </div>
      {
        emailSelected && (
          <Drawer title="Email Preview" onClose={() => setShowDetails(false)} open={showDetails} placement='left' width={680}>
            <EmailRenderPreview email={emailSelected} />
          </Drawer>
        )
      }
    </>
  )
}

export default DashboardPage

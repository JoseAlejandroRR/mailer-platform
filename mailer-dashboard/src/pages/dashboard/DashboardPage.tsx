import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Divider, Popover, Row, Segmented, Space, Statistic, Table, TableProps, Tag, Tooltip } from 'antd'
import { ClockCircleOutlined, LineChartOutlined, WarningOutlined } from '@ant-design/icons'
import useEmails from '../../data/hooks/useEmails'
import { EmailStatus } from '../../data/models/EmailStatus'
import { EmailDto } from '../../data/models/EmailDto'
import { DateToShortTextFormat, DateToTextRelative } from '../../data/utils'
import { useIsFirstRender } from '../../UI/utils'


const columns: TableProps<EmailDto>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (id) => <>
      <Tooltip title={id}>
        { id.substring(0, 8) }
      </Tooltip>
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
    title: 'Updated At',
    key: 'updatedAt',
    // eslint-disable-next-line no-unused-vars
    render: (_, { updatedAt }) => (
      <Space size="middle">
        <Popover title={DateToTextRelative(updatedAt)} content={
          <>
            { updatedAt }
          </>
        }>
          { DateToShortTextFormat(updatedAt) }
        </Popover>
      </Space>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    // eslint-disable-next-line no-unused-vars
    render: (_, record) => (
      <Space size="middle">
        <Tooltip title="Tracking">
          { record.provider && (
           <Popover title={"Tracking"} content={
            <>
              Sent with: { record.provider }
            </>
          }>
            <Button icon={<LineChartOutlined /> } type='text' />
          </Popover>
          )}
        </Tooltip>
      </Space>
    ),
  },
]

const emailDataInitial: Record<EmailStatus, EmailDto[]> = {
  [EmailStatus.SENT]: [],
  [EmailStatus.QUEUED]: [],
  [EmailStatus.OPENED]: [],
  [EmailStatus.FAILED]: [],
  [EmailStatus.PENDING]: [],
  [EmailStatus.DELIVERED]: [],
  [EmailStatus.MAX_TRIED]: []
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
        setEmailData((state) => ({ ...state, [currentStatus]: data.map((item) => ({ ...item, key:item.id})) }))
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

  return (
    <>
      <div className="page-dashboard">
        <Row gutter={20}>
          {
            Object.values(DashboardStatus).map((panel, index) => (
              <>
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
            </>
            ))
          }
        </Row>
        <Divider />
        <Segmented options={Object.values(DashboardStatus).map((panel) => panel.title)}
          onChange={handleCurrentView} block />
        <Divider />
        <Table<EmailDto> columns={columns} dataSource={emailData[currentView]} loading={loadingEmails}  />
      </div>
    </>
  )
}

export default DashboardPage

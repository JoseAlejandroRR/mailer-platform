import React, { useEffect, useState } from 'react'
import { CheckCircleOutlined, ClockCircleOutlined, LineChartOutlined, WarningOutlined } from '@ant-design/icons'
import { Button, Card, Col, Divider, notification, Popover, Row, Segmented, Space, Statistic, Table, TableProps, Tag, Tooltip } from 'antd'
import useEmails from '../../data/hooks/useEmails'
import { EmailStatus } from '../../data/models/EmailStatus'
import { EmailDto } from '../../data/models/EmailDto';
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
    render: () => (
      <Space size="middle">
        <Tooltip title="Tracking">
          <Button icon={<LineChartOutlined /> } type='text' onClick={() => notification.info({ message: 'Soon...', placement: 'bottomRight' })} />
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

const DashboardPage: React.FC = () => {
  const [ currentView, setCurrentView ] = useState<EmailStatus>(EmailStatus.SENT)
  const [ emailData, setEmailData ] = useState(emailDataInitial)
  const { getEmailsByStatus, loading: loadingEmails } = useEmails()
  const [requestStatus, setRequestStatus] = useState([
    EmailStatus.SENT,
    EmailStatus.QUEUED,
    EmailStatus.FAILED,
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
    setCurrentView(option)
  }

  return (
    <>
      <div className="page-dashboard">
        <Row gutter={20}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Sent"
                value={emailData[EmailStatus.SENT].length}
                valueStyle={{ color: '#3f8600' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Queue"
                value={emailData[EmailStatus.QUEUED].length}
                valueStyle={{ color: '#0061b3' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Failed"
                value={emailData[EmailStatus.FAILED].length}
                valueStyle={{ color: '#cf1322' }}
                prefix={<WarningOutlined />}
              />
            </Card>
          </Col>
        </Row>
        <Divider />
        <Segmented options={[EmailStatus.SENT, EmailStatus.QUEUED, EmailStatus.OPENED, EmailStatus.FAILED]}
          onChange={handleCurrentView} block />
        <Divider />
        <Table<EmailDto> columns={columns} dataSource={emailData[currentView]} loading={loadingEmails}  />
      </div>
    </>
  )
}

export default DashboardPage

import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Input, Button, Form, Tag, Table, TableProps, Tooltip, Popover, Space, notification, Segmented, Spin, Select, Drawer } from 'antd'
import { EyeOutlined, LoadingOutlined, SendOutlined, UndoOutlined, WarningOutlined } from '@ant-design/icons'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { EmailDto } from '../../data/models/EmailDto'
import { CreateEmailDto } from '../../data/models/CreateEmailDto'
import useEmails from '../../data/hooks/useEmails'
import { EmailStatus } from '../../data/models/EmailStatus'

import  './MailerPage.scss'
import { AxiosError } from 'axios'
import { EmailsTemplate } from './EmailsTemplate'

const SENDER_ADDRESSES: string[] = (import.meta.env.VITE_SENDER_EMAIL_ADDRESSES ? import.meta.env.VITE_SENDER_EMAIL_ADDRESSES.toString().split(',') : [])

type EmailRecord = EmailDto & { key: string }

const MailerPage: React.FC = () => {
  const [form] = Form.useForm()
  const [emailRecords, setEmailRecords] = useState<EmailRecord[]>([])
  const [editorValue, setEditorValue] = useState('')
  const { sendEmail, getEmailById, loading } = useEmails()
  const [ lastEmail, setLastEmail ] = useState<EmailDto>()
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  const [ showPreview, setShowPreview ] = useState(false)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  useEffect(() => {
    const template = EmailsTemplate[0]
    form.setFieldsValue({
      subject: template.subject,
      from: SENDER_ADDRESSES[0],
    })
    setEditorValue(template.body)
  }, [])

  const validateEmails = (emails: string): boolean => {
    return emails
      .split(',')
      .map((email) => email.trim())
      .every((email) => emailRegex.test(email))
  }

  const handleForm = async() => {
    form.validateFields().then(async (values) => {
      const serializedBody = JSON.stringify(editorValue)

      const newRecord: CreateEmailDto = {
        subject: values.subject,
        from: { name: values.from, email: values.from },
        to: (values.to || '').trim().split(',').map((email: string) =>({ name:  email.trim(),  email:  email.trim() })),
        cc: (values.cc || '').trim().split(',')
          .filter((item: string) => item.length > 0)
          .map((email: string) =>({ name:  email.trim(),  email:  email.trim() })),
        body: serializedBody,
        bcc: []
      }

      const res = await handleSendEmail(newRecord)
      if (!res) return;
 
      form.setFieldsValue({
        to: '',
        cc: ''
      })
    })
  }

  const handleSendEmail = async (input: CreateEmailDto): Promise<boolean> => {
    setIsLoading(true)
    try {
      const email = await sendEmail(input)
      if (!email) {
        notification.error({ message: 'Something bad happened', placement: 'bottomRight' })
        return false
      }
      setEmailRecords([...emailRecords, {...email, key: email.id }])
      setLastEmail(email)
      return true

    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.status, err.response?.status === 400)
        if (err.response?.status === 400) {
          const issues = err.response?.data?.error?.issues
          if (issues) {
            issues.forEach((error: any) => notification.error({
              message: `${error.path[0]}`, description: error.message, placement: 'bottomRight'
            }))
          }
        } else {
          notification.error({ message: 'Something bad happened', placement: 'bottomRight' })

        }
      }
      console.log('[handleSendEmail] Error:', err)
    } finally {
      setIsLoading(false)
    }
    return false
  }

  const handleRefreshStatus = async (email: EmailDto) => {
    try {
      const emailUpdated = await getEmailById(email.id)

      if (!emailUpdated) {
        notification.info({ message: 'Email not found', placement: 'bottomRight' });
        return;
      }

      const arr = emailRecords.map((item) => item.id === email.id ? { ...emailUpdated, key: emailUpdated.id } : item)
      setEmailRecords([...arr])
    } catch(err) {
      console.error('[Error]: ', err)
    }
  }

  const handleChangeTemplate = (name: string) => {
    const template = EmailsTemplate.find((tpl) => tpl.name === name)!

    form.setFieldsValue({ subject: template.subject})
    setEditorValue(template?.body)
  }

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
          {to.map((account, index) => {
            return (
              <Popover title={account.name} content={
                <>
                  { account.email }
                </>
              } key={index}>
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
      title: 'Tracking',
      key: 'status',
      dataIndex: 'status',
      // eslint-disable-next-line no-unused-vars
      render: (status, record) => (
        <Space size="middle">
          <Tooltip title="Refresh">
            <Button onClick={() => handleRefreshStatus(record)} type="text" icon={<UndoOutlined />} />
          </Tooltip>
          <Segmented<string>
            value={status}
            options={[EmailStatus.QUEUED, EmailStatus.SENT, EmailStatus.FAILED]}
          />
          {
            status === EmailStatus.MAX_TRIED && (
              <Tooltip title="MaxRetriesException">
                <WarningOutlined style={{ color:'#c40000' }} />
              </Tooltip>
            )
          }
        </Space>
      ),
    },
  ]

  return (
    <>
    <div className="mailer-page" style={{ padding: 16 }}>
      <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={14}>
          <Card title="Compose Email" bordered>
            <Row gutter={20}>
              <Col span={18}>
                <Form.Item
                  name="subject"
                  label="Subject"
                  rules={[{ required: true, message: 'Please enter a subject' }]}
                >
                  <Input placeholder="Subject" maxLength={50} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Template"
                  name="template"
                >
                  <Select defaultValue={EmailsTemplate[0].name} onChange={handleChangeTemplate}>
                    {
                      EmailsTemplate.map((tpl, index) => (
                        <Select.Option key={index} value={tpl.name }>{ tpl.name }</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="">
              <ReactQuill theme="snow" value={editorValue} onChange={setEditorValue}
              style={{ height: '200px', marginBottom: '25px'}} />
            </Form.Item>
          </Card>
        </Col>
        <Col span={10}>
          <Card title="Recipients" bordered>
            <Form.Item
              label="From"
              name="from"
            >
              <Select>
                {
                  SENDER_ADDRESSES.map((email, index) => (
                    <Select.Option key={index} value={email}>{ email }</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item name="to" label="To"
              rules={[
                {
                  required: true,
                  message: 'Please enter at least one recipient',
                },
                {
                  validator: (_, value) => {
                    if (!value || validateEmails(value)) {
                      return Promise.resolve()
                    }
                    return Promise.reject(
                      new Error('All To addresses must be valid email addresses')
                    )
                  },
                },
              ]}
              >
              <Input.TextArea
                placeholder="Enter recipient emails (comma-separated)"
                rows={2}
              />
            </Form.Item>
            <Form.Item name="cc" label="CC"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value || validateEmails(value)) {
                      return Promise.resolve()
                    }
                    return Promise.reject(
                      new Error('All CC addresses must be valid email addresses')
                    )
                  },
                },
              ]}
            >
              <Input.TextArea
                placeholder="Enter CC emails (comma-separated)"
                rows={2}
              />
            </Form.Item>
            <Row gutter={20}>
              <Col span={12}>
                <Button
                  type="default"
                  icon={<EyeOutlined />}
                  onClick={() => setShowPreview(true)}
                  block
                >
                  Preview
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleForm}
                  loading={isLoading}
                  block
                >
                  Send Email
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      </Form>

      {/* Email Records List */}
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Sent Emails" bordered>
          <Table<EmailDto> columns={columns} dataSource={emailRecords} loading={false}
            rowClassName={(record) => record.id === lastEmail?.id ? 'highlighted-row' : ''}  />
          </Card>
        </Col>
      </Row>
      {
        loading && (
          <div className="loading-spinner">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          </div>
        )
      }
    </div>
      <Drawer title="Email Preview" onClose={() => setShowPreview(false)} open={showPreview} placement='left' width={680}>
      <div
        dangerouslySetInnerHTML={{ __html: editorValue }}
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '5px',
          backgroundColor: '#f9f9f9',
        }}
      />
      </Drawer>
    </>
  )
}

export default MailerPage

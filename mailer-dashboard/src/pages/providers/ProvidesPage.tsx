import { Button, Col, Divider, Drawer, notification, Popconfirm, Popover, Row, Space, Table, TableProps, Tag, Tooltip, Typography } from 'antd'
import { EmailProviderDto } from '../../data/models/ProviderEmailDto'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { EmailProviderStatus } from '../../data/models/EmailProviderStatus'
import { DateToTextRelative } from '../../data/utils'
import useProviders from '../../data/hooks/useProviders'
import { useEffect, useState } from 'react'
import ProviderForm from '../../UI/components/provider-form/ProviderForm'

const { Title } = Typography


const ProvidesPage = () => {
  const { providers, getAllProviders, deleteById, loading } = useProviders()
  const [ showForm, setShowForm ] = useState<boolean>(false)
  const [ hasChanges, setHasChanges ] = useState<boolean>(false)
  const [ currentProvider, setCurrentProvider ] = useState<EmailProviderDto | null>(null)


  useEffect(() => {
    (async() => {
      getAllProviders()
    })()
  }, [])

  const columns: TableProps<EmailProviderDto>['columns'] = [
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <span>{name}</span>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priotity',
      render: (priotity) => <span>{priotity}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) => (
        <>
        <Popover title="Current Status">
         <Tag color={status === EmailProviderStatus.ACTIVE ? 'green' : 'default'}>
            { status }
          </Tag>
        </Popover>
        </>
      ),
    },
    {
      title: 'Registered At',
      key: 'createdAt',
      dataIndex:'createdAt',
      // eslint-disable-next-line no-unused-vars
      render: (_, { createdAt }) => (
        <Space size="middle">
          <Popover title={DateToTextRelative(createdAt)} content={
            <>
              { createdAt?.toISOString() }
            </>
          }>
            { createdAt?.toUTCString() }
          </Popover>
        </Space>
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
              { updatedAt?.toISOString() }
            </>
          }>
            { updatedAt?.toUTCString() }
          </Popover>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'status',
      dataIndex: 'status',
      // eslint-disable-next-line no-unused-vars
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button onClick={() => handleEditProvider(record)} type="text" icon={<EditOutlined />} />
          </Tooltip>
          <Popconfirm title="Confirm to delete" onConfirm={() => handleDeleteProvider(record)}>
            <Button type="text" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleNewProvider = () => {
    setHasChanges(false)
    setShowForm(true)
    setCurrentProvider(null)
  }

  const handleEditProvider = async (provider: EmailProviderDto) => {
    setHasChanges(false)
    setCurrentProvider(provider)
    setShowForm(true)
  }

  const handleDeleteProvider = async (provider: EmailProviderDto) => {
    try {
      await deleteById(provider.id)
      notification.success({ message: 'Provider deleted', placement: 'bottomRight'})
      await getAllProviders()
    } catch (err) {
      notification.error({ message: 'Provider can´t be deleted', placement: 'bottomRight'})
      console.log('[handleDeleteProvider] Error: ', err)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    if (hasChanges) {
      getAllProviders()
    }
  }

  const handleDataChanged = async (provider: EmailProviderDto | null) => {
    if (provider) {
      setCurrentProvider(provider)
      setHasChanges(true)
    }
  }

  return (
    <>
      <div className="providers-page">
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={2} style={{ margin: 0 }}>Providers</Title>
        </Col>
        <Col>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleNewProvider}>Register</Button>
          </Space>
        </Col>
      </Row>
      <Divider />
      <Table<EmailProviderDto> columns={columns} dataSource={providers.map((item) => ({...item, key: item.id}))} loading={loading}/>
      </div>
      <Drawer title="Provider Form" onClose={handleCloseForm} open={showForm}>
        <ProviderForm provider={currentProvider ?? null} onDataChange={handleDataChanged} />
      </Drawer>
    </>
  )
}

export default ProvidesPage

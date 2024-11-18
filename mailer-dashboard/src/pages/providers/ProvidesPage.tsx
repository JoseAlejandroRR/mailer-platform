import { Button, Col, Divider, Drawer, notification, Popconfirm, Row, Space, Table, TableProps, Tooltip, Typography } from 'antd'
import { EmailProviderDto } from '../../data/models/ProviderEmailDto'
import { EditOutlined, DeleteOutlined, PlusOutlined, UndoOutlined, EyeOutlined } from '@ant-design/icons'
import useProviders from '../../data/hooks/useProviders'
import { useEffect, useState } from 'react'
import ProviderForm from '../../UI/components/provider-form/ProviderForm'
import DatetimeView from '../../UI/components/datetime-view/DatetimeView'
import ProviderStatusView from '../../UI/components/providers/ProviderStatusView'

const { Title } = Typography


const ProvidesPage = () => {
  const { providers, getAllProviders, deleteById, loading } = useProviders()
  const [ showForm, setShowForm ] = useState<boolean>(false)
  const [ showDetails, setShowDetails ] = useState<boolean>(false)
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
        <ProviderStatusView status={status} />
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
          <DatetimeView datetime={createdAt} />
        </Space>
      ),
    },
    {
      title: 'Updated At',
      key: 'updatedAt',
      // eslint-disable-next-line no-unused-vars
      render: (_, { updatedAt }) => (
        <Space size="middle">
          <DatetimeView datetime={updatedAt} />
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
          <Tooltip title="Details">
            <Button onClick={() => handleShowProvider(record)} type="text" icon={<EyeOutlined />} />
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

  const handleShowProvider = async (provider: EmailProviderDto) => {
    setCurrentProvider(provider)
    setShowDetails(true)
  }

  const handleRefresh = async () => {
   await getAllProviders()
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
            <Button icon={<UndoOutlined />} onClick={handleRefresh}>Refresh</Button>
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
      <Drawer title="Provider Details" onClose={() => setShowDetails(false)} open={showDetails} placement="left" width={520}>
        {
          currentProvider && (
            <>
            <Title level={3}>{currentProvider?.name}</Title>
            <Divider />
            <Title level={5}>Status: <ProviderStatusView status={currentProvider!.status} /> </Title>
            <Title level={5}>Priority: {currentProvider?.priority}</Title>
            <Title level={5}>Updated At: <DatetimeView datetime={currentProvider!.updatedAt} /></Title>
            {
              currentProvider?.log && (
                <>
                <Title level={5}>Error Log:</Title>
                <div
                  dangerouslySetInnerHTML={{ __html: currentProvider?.log ?? '' }}
                  style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    borderRadius: '5px',
                    backgroundColor: '#f9f9f9',
                  }}
                />
                </>
              )
            }
            </>
          )
        }
      </Drawer>
    </>
  )
}

export default ProvidesPage

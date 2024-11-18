import React, { useEffect } from 'react'
import type { FormProps } from 'antd'
import { Button, Divider, Form, Input, notification, Select, } from 'antd'
import { EmailProviderDto } from '../../../data/models/ProviderEmailDto'
import useProviders from '../../../data/hooks/useProviders'
import { EmailProviderStatus } from '../../../data/models/EmailProviderStatus'
import { CreateEmailProviderDto } from '../../../data/models/CreateEmailProviderDto'

type FieldType = CreateEmailProviderDto

type ProviderFormProps = {
  provider: EmailProviderDto | null
  onDataChange: (provider: EmailProviderDto | null) => void
}

const initialValues = {
  name: '',
  priority: 1,
  status: EmailProviderStatus.ACTIVE,
}

const ProviderForm: React.FC<ProviderFormProps> = ({ provider, onDataChange }) => {
  const { createProvider, updateProvider, loading } = useProviders()
  const [ form ] = Form.useForm()

  useEffect(() => {
    if (!provider) {
      form.setFieldsValue(initialValues)
      return
    }

    form.setFieldsValue({
      name: provider.name,
      priority: provider.priority,
      status: provider.status,
    })
  }, [provider])

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {

    try {
      let res = null
      if (!provider) {
        res = await createProvider(values)
        notification.success({ message: 'Provider created', placement: 'bottomRight' })
      } else {
        res = await updateProvider(provider.id, values)
        notification.success({ message: 'Provider updated', placement: 'bottomRight' })
      }
      onDataChange(res)
    } catch(err) {
      notification.error({ message: 'Something bad happened', placement: 'bottomRight' })
      console.log('[onFinish] Error: ', err)
    }
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Form
      name="provider-form"
      form={form}
      layout="vertical"
      initialValues={{ remember: false }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Provider name is missing' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="priority"
        name="priority"
        rules={[{ required: true, message: 'Priority is missing' }]}
      >
        <Select>
          {
            [...Array(10).keys()].map((value, index) => (
              <Select.Option key={index} value={Number(value)+1}>{Number(value)+1}</Select.Option>
            ))
          }
        </Select>
      </Form.Item>

      <Form.Item<FieldType>
        label="Status"
        name="status"
        rules={[{ required: true, message: 'Choose status' }]}
      >
        <Select>
          {
            Object.values(EmailProviderStatus).map((value, index) => (
              <Select.Option key={index} value={value }>{ value }</Select.Option>
            ))
          }
        </Select>
      </Form.Item>

      <Divider />
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ProviderForm

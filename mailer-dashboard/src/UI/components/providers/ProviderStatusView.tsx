import { Popover, Tag } from 'antd'
import React from 'react'
import { EmailProviderStatus } from '../../../data/models/EmailProviderStatus'

type ProviderStatusViewProps = {
  status: EmailProviderStatus,
  title?: string
}

const ProviderStatusView:React.FC<ProviderStatusViewProps> = ({
  status, title = 'Current Status'
}) => {
  return (
    <>
    <Popover title={title}>
      <Tag color={status === EmailProviderStatus.ACTIVE ? 'green' : 'default'}>
        { status }
      </Tag>
    </Popover>
    </>
  )
}

export default ProviderStatusView

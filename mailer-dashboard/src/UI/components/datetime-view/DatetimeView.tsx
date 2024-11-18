import React from 'react'
import { Popover } from 'antd'
import { DateToShortTextFormat, DateToTextRelative } from '../../../data/utils'

type DatetimeViewProps = {
  datetime: Date,
  format?: 'short' | 'long'
}
const DatetimeView: React.FC<DatetimeViewProps> = ({ datetime, format = 'short' }) => {
  return (
    <>
      <Popover title={DateToTextRelative(datetime)} content={
        <>
          { datetime?.toISOString() }
        </>
      }>
        { format === 'long'?  datetime?.toUTCString() :DateToShortTextFormat(datetime)}
      </Popover>
    </>
  )
}

export default DatetimeView

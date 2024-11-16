import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const DateTimetoShortText = (date: Date) => {
  const startDate = dayjs(date)

  return startDate.format('YYYY-MM-DD')
}

export const DateToShortTextFormat = (date: Date): string => {
  const startDate = dayjs(date)
  
  return startDate.format('MMMM D, YYYY')
}

export const DateToFormatTextHuman = (date: Date): string => {
  const startDate = dayjs(date)
  const now = dayjs()

  const years = now.diff(startDate, 'year')
  const months = now.diff(startDate.add(years, 'year'), 'month');
  const days = now.diff(startDate.add(years, 'year').add(months, 'month'), 'day');

  return `${years}y - ${months}m - ${days}d`
}

export const DateToTextRelative = (date: Date): string => {
  const startDate = dayjs(date)

  return startDate.fromNow()
}

export const isAuthActive = (): boolean => import.meta.env.VITE_AUTH_LAYER_ACTIVE === 'true'

export const avatarDefaultURL = '/assets/images/user-profile-default.jpg'

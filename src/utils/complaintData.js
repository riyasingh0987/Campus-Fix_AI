export const COMPLAINT_CATEGORIES = [
  'Electricity',
  'Water',
  'Wi-Fi',
  'Hostel',
  'Cleanliness',
  'Infrastructure',
  'Other',
]

export const COMPLAINT_STATUSES = [
  'Pending',
  'Approved',
  'In Progress',
  'Resolved',
  'Rejected',
]

export const COMPLAINT_PRIORITIES = ['Low', 'Medium', 'High', 'Critical']

export function sortNewestFirst(complaints) {
  return [...complaints].sort((first, second) => {
    const firstTime = first.createdAt?.toMillis?.() ?? 0
    const secondTime = second.createdAt?.toMillis?.() ?? 0
    return secondTime - firstTime
  })
}

export function formatDate(value) {
  if (!value) return 'Date unavailable'
  const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date unavailable'
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function nextStatuses(status) {
  const transitions = {
    Pending: ['Approved', 'Rejected'],
    Approved: ['In Progress'],
    'In Progress': ['Resolved'],
    Resolved: [],
    Rejected: [],
  }
  return transitions[status] ?? []
}
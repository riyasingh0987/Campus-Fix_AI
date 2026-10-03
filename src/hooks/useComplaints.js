import { useEffect, useState } from 'react'
import { db, firebaseConfigured } from '../services/firebase.js'
import {
  subscribeToAllComplaints,
  subscribeToComplaint,
  subscribeToStudentComplaints,
} from '../services/complaints.js'

function useComplaintSubscription(key, mode) {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(firebaseConfigured)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!key || !db) return undefined
    const onChange = (nextComplaints) => {
      setComplaints(nextComplaints)
      setLoading(false)
    }
    const onError = (subscriptionError) => {
      setError(subscriptionError.message || 'Could not load complaints.')
      setLoading(false)
    }
    return mode === 'student'
      ? subscribeToStudentComplaints(key, onChange, onError)
      : subscribeToAllComplaints(onChange, onError)
  }, [key, mode])

  return { complaints, loading, error }
}

export function useStudentComplaints(studentId) {
  return useComplaintSubscription(studentId, 'student')
}

export function useAllComplaints(enabled = true) {
  return useComplaintSubscription(enabled ? 'all' : '', 'admin')
}

export function useComplaint(complaintId) {
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(firebaseConfigured)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!complaintId || !db) return undefined
    return subscribeToComplaint(
      complaintId,
      (nextComplaint) => {
        setComplaint(nextComplaint)
        setLoading(false)
      },
      (subscriptionError) => {
        setError(subscriptionError.message || 'Could not load this complaint.')
        setLoading(false)
      },
    )
  }, [complaintId])

  return { complaint, loading, error }
}
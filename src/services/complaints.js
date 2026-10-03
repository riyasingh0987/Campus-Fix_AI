import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from './firebase.js'
import { nextStatuses, sortNewestFirst } from '../utils/complaintData.js'

function requireDatabase() {
  if (!db) throw new Error('Firebase is not configured. Add project values to .env.local first.')
  return db
}

export async function createComplaint({ student, details }) {
  const database = requireDatabase()
  const complaintRef = doc(collection(database, 'complaints'))
  const complaint = {
    ...details,
    id: complaintRef.id,
    studentId: student.uid,
    studentName: student.name,
    studentEmail: student.email,
    priority: 'Medium',
    status: 'Pending',
    statusHistory: [{
      status: 'Pending',
      remark: 'Complaint submitted',
      updatedBy: student.uid,
      updatedByName: student.name,
      timestamp: Timestamp.now(),
    }],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
  await setDoc(complaintRef, complaint)
  return complaintRef.id
}

export function subscribeToStudentComplaints(studentId, onChange, onError) {
  const database = requireDatabase()
  const complaintsQuery = query(
    collection(database, 'complaints'),
    where('studentId', '==', studentId),
  )
  return onSnapshot(
    complaintsQuery,
    (snapshot) => onChange(sortNewestFirst(snapshot.docs.map((item) => item.data()))),
    onError,
  )
}

export function subscribeToAllComplaints(onChange, onError) {
  const database = requireDatabase()
  const complaintsQuery = query(collection(database, 'complaints'), orderBy('createdAt', 'desc'))
  return onSnapshot(
    complaintsQuery,
    (snapshot) => onChange(sortNewestFirst(snapshot.docs.map((item) => item.data()))),
    onError,
  )
}

export function subscribeToComplaint(complaintId, onChange, onError) {
  const database = requireDatabase()
  return onSnapshot(
    doc(database, 'complaints', complaintId),
    (snapshot) => onChange(snapshot.exists() ? snapshot.data() : null),
    onError,
  )
}

export async function transitionComplaint({ complaintId, nextStatus, remark, admin }) {
  const database = requireDatabase()
  const complaintRef = doc(database, 'complaints', complaintId)

  // Re-read the current status in the transaction so a stale admin tab cannot skip a step.
  await runTransaction(database, async (transaction) => {
    const snapshot = await transaction.get(complaintRef)
    if (!snapshot.exists()) throw new Error('This complaint no longer exists.')
    const complaint = snapshot.data()
    if (!nextStatuses(complaint.status).includes(nextStatus)) {
      throw new Error(`A complaint cannot move from ${complaint.status} to ${nextStatus}.`)
    }

    const historyEntry = {
      status: nextStatus,
      remark: remark.trim(),
      updatedBy: admin.uid,
      updatedByName: admin.name,
      timestamp: Timestamp.now(),
    }
    // arrayUnion appends the transition without replacing earlier timeline entries.
    transaction.update(complaintRef, {
      status: nextStatus,
      adminRemark: remark.trim(),
      statusHistory: arrayUnion(historyEntry),
      updatedAt: serverTimestamp(),
    })
  })
}

export async function updateComplaintPriority(complaintId, priority) {
  const database = requireDatabase()
  await updateDoc(doc(database, 'complaints', complaintId), {
    priority,
    updatedAt: serverTimestamp(),
  })
}
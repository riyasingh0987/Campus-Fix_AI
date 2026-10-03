import { useEffect, useState } from 'react'
import { ArrowLeft, Check, ImagePlus, LoaderCircle, Sparkles, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import WorkspaceLayout from '../../components/WorkspaceLayout.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import useDebouncedValue from '../../hooks/useDebouncedValue.js'
import { createComplaint } from '../../services/complaints.js'
import { uploadComplaintImage, validateComplaintImage } from '../../services/cloudinary.js'
import { classifyCategory } from '../../utils/categoryFallback.js'
import { COMPLAINT_CATEGORIES } from '../../utils/complaintData.js'

const fieldClass = 'min-h-11 w-full rounded-lg border border-line bg-white px-3.5 text-sm text-ink outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand focus:ring-4 focus:ring-brand/10'

export default function NewComplaint() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Other')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [imageError, setImageError] = useState('')
  const [suggestion, setSuggestion] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSource, setAiSource] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const debouncedDescription = useDebouncedValue(description, 800)

  useEffect(() => {
    if (!preview) return undefined
    return () => URL.revokeObjectURL(preview)
  }, [preview])

  useEffect(() => {
    const trimmedDescription = debouncedDescription.trim()
    if (trimmedDescription.length < 15) return undefined

    // useDebouncedValue changes only after the student pauses typing for 800 ms.
    let isActive = true
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setAiLoading(true)
      try {
        const response = await fetch('/api/suggest-category', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description: trimmedDescription }),
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Suggestion service is unavailable.')
        const result = await response.json()
        if (!COMPLAINT_CATEGORIES.includes(result.category)) throw new Error('Suggestion was not recognized.')
        if (isActive) {
          setSuggestion(result)
          setAiSource('AI suggestion')
        }
      } catch {
        if (isActive) {
          setSuggestion(classifyCategory(trimmedDescription))
          setAiSource('Keyword suggestion')
        }
      } finally {
        if (isActive) setAiLoading(false)
      }
    }, 0)

    return () => {
      isActive = false
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [debouncedDescription])

  function handleImageChange(event) {
    const selectedImage = event.target.files?.[0]
    if (!selectedImage) return
    const validationError = validateComplaintImage(selectedImage)
    if (validationError) {
      setImageError(validationError)
      setImage(null)
      setPreview('')
      event.target.value = ''
      return
    }
    setImageError('')
    setImage(selectedImage)
    setPreview(URL.createObjectURL(selectedImage))
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value)
    setSuggestion(null)
    setAiSource('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    try {
      let imageUrl
      if (image) imageUrl = await uploadComplaintImage(image)
      await createComplaint({
        student: currentUser,
        details: {
          title: title.trim(),
          category,
          description: description.trim(),
          location: location.trim(),
          ...(imageUrl ? { imageUrl } : {}),
          ...(suggestion ? { aiSuggestedCategory: suggestion.category } : {}),
        },
      })
      toast.success('Your complaint has been submitted.')
      navigate('/student/complaints', { replace: true })
    } catch (error) {
      toast.error(error.message || 'Could not submit your complaint.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <WorkspaceLayout role="student">
      <div className="mx-auto max-w-3xl">
        <Link to="/student" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand"><ArrowLeft size={16} />Dashboard</Link>
        <div className="mt-5"><p className="text-sm font-semibold text-brand">New report</p><h1 className="mt-1 text-3xl font-bold text-ink">What needs attention?</h1><p className="mt-2 text-sm leading-6 text-muted">Share a few details so the campus team can locate and review the issue.</p></div>
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-line bg-white p-5 sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><label htmlFor="title" className="mb-2 block text-sm font-semibold text-ink">Title</label><input id="title" name="title" required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} className={fieldClass} placeholder="A short summary of the issue" /></div>
            <div><label htmlFor="category" className="mb-2 block text-sm font-semibold text-ink">Category</label><select id="category" name="category" value={category} onChange={(event) => setCategory(event.target.value)} className={fieldClass}>{COMPLAINT_CATEGORIES.map((option) => <option key={option}>{option}</option>)}</select></div>
            <div><label htmlFor="location" className="mb-2 block text-sm font-semibold text-ink">Location</label><input id="location" name="location" required maxLength={160} value={location} onChange={(event) => setLocation(event.target.value)} className={fieldClass} placeholder="Building, floor, room, or area" /></div>
            <div className="sm:col-span-2">
              <div className="mb-2 flex items-center justify-between gap-3"><label htmlFor="description" className="block text-sm font-semibold text-ink">Description</label><span className="text-xs tabular-nums text-slate-400">{description.length}/2000</span></div>
              <textarea id="description" name="description" required minLength={15} maxLength={2000} rows={6} value={description} onChange={handleDescriptionChange} className={`${fieldClass} min-h-36 resize-y py-3 leading-6`} placeholder="Describe what is happening and when you first noticed it." />
              {aiLoading && <p className="mt-2 inline-flex items-center gap-2 text-xs text-muted"><LoaderCircle size={14} className="animate-spin" />Checking for a category suggestion…</p>}
              {!aiLoading && suggestion && suggestion.category !== category && <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50/70 px-3 py-2 text-sm"><Sparkles size={15} className="text-brand" /><span className="font-medium text-ink">{aiSource}: {suggestion.category}. Use this?</span><button type="button" onClick={() => setCategory(suggestion.category)} className="inline-flex min-h-7 items-center gap-1 rounded-md bg-white px-2.5 text-xs font-bold text-brand ring-1 ring-indigo-200 hover:bg-indigo-100"><Check size={13} />Use</button><button type="button" onClick={() => setSuggestion(null)} aria-label="Dismiss category suggestion" className="ml-auto grid h-7 w-7 place-items-center rounded-md text-slate-500 hover:bg-white"><X size={14} /></button></div>}
              {!aiLoading && suggestion && suggestion.category === category && <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-700"><Check size={14} />Category matches the {aiSource.toLowerCase()}.</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="image" className="mb-2 block text-sm font-semibold text-ink">Photo <span className="font-normal text-muted">(optional, JPG or PNG up to 2 MB)</span></label>
              <div className="flex flex-wrap items-center gap-4"><label htmlFor="image" className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-line px-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-within:ring-4 focus-within:ring-brand/10"><ImagePlus size={17} />Choose image</label><input id="image" name="image" type="file" accept="image/jpeg,image/png" onChange={handleImageChange} className="sr-only" aria-describedby="image-help" />{image && <span id="image-help" className="text-xs text-muted">{image.name} · {(image.size / 1024 / 1024).toFixed(2)} MB</span>}</div>
              {imageError && <p role="alert" className="mt-2 text-sm text-rose-700">{imageError}</p>}
              {preview && <div className="relative mt-4 w-fit"><img src={preview} alt="Selected complaint attachment preview" className="max-h-56 max-w-full rounded-lg border border-line object-contain" /><button type="button" onClick={() => { setImage(null); setPreview(''); }} aria-label="Remove selected image" className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-ink text-white shadow"><X size={14} /></button></div>}
            </div>
          </div>
          <div className="mt-7 flex flex-col-reverse justify-end gap-3 border-t border-line pt-5 sm:flex-row"><Link to="/student" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</Link><button type="submit" disabled={submitting} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60">{submitting && <LoaderCircle size={16} className="animate-spin" />}{submitting ? 'Submitting…' : 'Submit complaint'}</button></div>
        </form>
      </div>
    </WorkspaceLayout>
  )
}
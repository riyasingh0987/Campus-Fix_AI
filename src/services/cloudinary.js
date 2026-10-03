const MAX_IMAGE_BYTES = 2 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png']

export function validateComplaintImage(file) {
  if (!file) return 'Choose a JPG or PNG image.'
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return 'Image must be a JPG or PNG file.'
  if (file.size > MAX_IMAGE_BYTES) return 'Image must be 2 MB or smaller.'
  return ''
}

export async function uploadComplaintImage(file) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  if (!cloudName || !uploadPreset) {
    throw new Error('Image uploads are not configured. Add the Cloudinary values to .env.local.')
  }

  const formData = new FormData()
  formData.append('file', file)
  // Cloudinary's unsigned preset lets the browser upload without a server or secret key.
  formData.append('upload_preset', uploadPreset)
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  })
  const result = await response.json()
  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message || 'Image upload failed. Please try again.')
  }
  return result.secure_url
}
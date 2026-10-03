const CATEGORIES = [
  'Electricity',
  'Water',
  'Wi-Fi',
  'Hostel',
  'Cleanliness',
  'Infrastructure',
  'Other',
]

function sendJson(response, statusCode, body) {
  return response.status(statusCode).json(body)
}

export default async function handler(request, response) {
  const origin = request.headers.origin || '*'
  response.setHeader('Access-Control-Allow-Origin', origin)
  response.setHeader('Vary', 'Origin')
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  response.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (request.method === 'OPTIONS') return response.status(204).end()
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST, OPTIONS')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }

  const description = typeof request.body?.description === 'string'
    ? request.body.description.trim()
    : ''
  if (!description || description.length > 2500) {
    return sendJson(response, 400, { error: 'Description must be between 1 and 2500 characters.' })
  }

  // This server-only key is never included in the response or browser bundle.
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return sendJson(response, 500, { error: 'The category suggestion service is not configured.' })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const upstreamResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: `Classify the campus complaint into exactly one category: ${CATEGORIES.join(', ')}. Choose the best matching category from the description. Return only the requested JSON object.`,
            }],
          },
          contents: [{ role: 'user', parts: [{ text: description }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                category: { type: 'STRING', enum: CATEGORIES },
                confidence: { type: 'NUMBER' },
              },
              required: ['category', 'confidence'],
            },
          },
        }),
        signal: controller.signal,
      },
    )

    if (!upstreamResponse.ok) throw new Error(`Gemini returned ${upstreamResponse.status}.`)
    const responseBody = await upstreamResponse.json()
    const responseText = responseBody.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('')
    const suggestion = JSON.parse(responseText || '{}')
    const category = CATEGORIES.includes(suggestion.category) ? suggestion.category : 'Other'
    const confidenceValue = Number(suggestion.confidence)
    const confidence = Number.isFinite(confidenceValue)
      ? Math.min(1, Math.max(0, confidenceValue))
      : 0

    return sendJson(response, 200, { category, confidence })
  } catch {
    return sendJson(response, 500, { error: 'Could not suggest a category right now.' })
  } finally {
    clearTimeout(timeout)
  }
}
const KEYWORDS = {
  Electricity: ['fan', 'light', 'switch', 'power', 'electric', 'bulb', 'socket', 'outlet', 'wiring'],
  Water: ['tap', 'leak', 'water', 'tank', 'pipe', 'faucet', 'drain', 'plumbing', 'flood'],
  'Wi-Fi': ['wifi', 'wi-fi', 'internet', 'network', 'router', 'connection', 'broadband'],
  Hostel: ['hostel', 'dorm', 'residence', 'room', 'bed', 'wardens'],
  Cleanliness: ['dirty', 'clean', 'garbage', 'trash', 'rubbish', 'toilet', 'washroom', 'hygiene'],
  Infrastructure: ['wall', 'ceiling', 'door', 'window', 'building', 'road', 'pothole', 'furniture'],
}

export function classifyCategory(description) {
  const text = description.toLowerCase()
  let bestCategory = 'Other'
  let bestMatchCount = 0

  for (const [category, words] of Object.entries(KEYWORDS)) {
    const matchCount = words.reduce((count, word) => count + (text.includes(word) ? 1 : 0), 0)
    if (matchCount > bestMatchCount) {
      bestCategory = category
      bestMatchCount = matchCount
    }
  }

  return { category: bestCategory, confidence: bestMatchCount > 0 ? 0.55 : 0.25 }
}
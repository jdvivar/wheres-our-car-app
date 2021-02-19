async function getCars (user) {
  if (!user) {
    return []
  }
  const endpoint = '/.netlify/functions/getCars'
  const response = await window.fetch(`${endpoint}?user=${user}`)
  if (response.status !== 200) {
    return []
  }
  const data = await response.json()
  return data
}

export {
  getCars
}

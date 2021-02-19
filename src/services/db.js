// import { wocState } from '../state.js'

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

async function getLocations (car) {
  if (!car) {
    return []
  }
  const endpoint = '/.netlify/functions/getLocations'
  const response = await window.fetch(`${endpoint}?car=${car}`)
  if (response.status !== 200) {
    return []
  }
  const data = await response.json()
  return data
}

export {
  getCars,
  getLocations
}

const endpoint = '/.netlify/functions/cars'

async function getCars () {
  const response = await window.fetch(endpoint)
  if (response.status !== 200) {
    return []
  }
  const data = await response.json()
  return data
}

async function createCar (name) {
  await window.fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({ name })
  })
}

export {
  getCars,
  createCar
}

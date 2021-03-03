const carsEndpoint = '/api/cars'
const LocationsEndpoint = '/api/locations'

async function getCars () {
  const response = await window.fetch(carsEndpoint)
  if (response.status !== 200) {
    return []
  }
  const data = await response.json()
  return data
}

async function createCar (name) {
  await window.fetch(carsEndpoint, {
    method: 'POST',
    body: JSON.stringify({ name })
  })
}

async function removeCar (id) {
  await window.fetch(carsEndpoint, {
    method: 'DELETE',
    body: JSON.stringify({ id })
  })
}

async function renameCar ({ id, name }) {
  await window.fetch(carsEndpoint, {
    method: 'PATCH',
    body: JSON.stringify({ id, name })
  })
}

async function removeLocation (id) {
  await window.fetch(LocationsEndpoint, {
    method: 'DELETE',
    body: JSON.stringify({ id })
  })
}

async function createLocation ({ geo, carId }) {
  await window.fetch(LocationsEndpoint, {
    method: 'POST',
    body: JSON.stringify({ geo, carId })
  })
}

export {
  getCars,
  createCar,
  removeCar,
  renameCar,
  removeLocation,
  createLocation
}

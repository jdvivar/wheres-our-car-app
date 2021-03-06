const CARS = '/api/cars'
const LOCATIONS = '/api/locations'
const INVITE = '/api/invite'

async function getCars () {
  const response = await window.fetch(CARS)
  if (response.status !== 200) {
    return []
  }
  const data = await response.json()
  return data
}

async function createCar (name) {
  await window.fetch(CARS, {
    method: 'POST',
    body: JSON.stringify({ name })
  })
}

async function removeCar (id) {
  await window.fetch(CARS, {
    method: 'DELETE',
    body: JSON.stringify({ id })
  })
}

async function renameCar ({ id, name }) {
  await window.fetch(CARS, {
    method: 'PATCH',
    body: JSON.stringify({ id, name })
  })
}

async function removeLocation (id) {
  await window.fetch(LOCATIONS, {
    method: 'DELETE',
    body: JSON.stringify({ id })
  })
}

async function createLocation ({ geo, carId }) {
  await window.fetch(LOCATIONS, {
    method: 'POST',
    body: JSON.stringify({ geo, carId })
  })
}

async function getInvitation () {
  const response = await window.fetch(INVITE)
  const data = await response.json()
  return data
}

async function acceptInvitation () {
  await window.fetch(INVITE, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'accepted' })
  })
}

async function rejectInvitation () {
  await window.fetch(INVITE, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'rejected' })
  })
}

export {
  getCars,
  createCar,
  removeCar,
  renameCar,
  removeLocation,
  createLocation,
  getInvitation,
  acceptInvitation,
  rejectInvitation
}

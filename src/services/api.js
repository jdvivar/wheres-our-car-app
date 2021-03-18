import { store, signOutState } from '../../services/state.js'

const CARS = '/api/cars'
const LOCATIONS = '/api/locations'
const INVITE = '/api/invite'
const AUTH = '/api/auth'

const legacyFetch = window.fetch
window.fetch = async function () {
  let response
  try {
    response = await legacyFetch.apply(this, arguments)
    if (response.status === 401) {
      store.dispatch(signOutState())
    }
  } catch (error) {
    console.log(error.toString())
  }
  return response
}

async function getCars () {
  const response = await window.fetch(CARS)
  if (response.status !== 200) {
    return []
  }
  return await response.json()
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

async function renameCar (args) {
  await window.fetch(CARS, {
    method: 'PATCH',
    body: JSON.stringify(args)
  })
}

async function getLocations (id) {
  const response = await window.fetch(`${LOCATIONS}?id=${id}`)
  if (response.status !== 200) {
    return []
  }
  return await response.json()
}

async function removeLocation (args) {
  await window.fetch(LOCATIONS, {
    method: 'DELETE',
    body: JSON.stringify(args)
  })
}

async function createLocation (args) {
  await window.fetch(LOCATIONS, {
    method: 'POST',
    body: JSON.stringify(args)
  })
}

async function getInvitation () {
  const response = await window.fetch(INVITE)
  if (response.status !== 200) {
    return false
  }
  return await response.json()
}

async function getInvitations (id) {
  const response = await window.fetch(`${INVITE}?forId=${id}`)
  if (response.status !== 200) {
    return []
  }
  return await response.json()
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

async function removeInvitation (id) {
  await window.fetch(`${INVITE}`, {
    method: 'DELETE',
    body: JSON.stringify({ status: 'stopped', id })
  })
}

async function createInvitation (args) {
  await window.fetch(INVITE, {
    method: 'POST',
    body: JSON.stringify(args)
  })
}

async function signIn () {
  await window.fetch(`${AUTH}/signin`)
}

async function signOut () {
  await window.fetch(`${AUTH}/signout`)
}

export {
  getCars,
  createCar,
  removeCar,
  renameCar,
  getLocations,
  removeLocation,
  createLocation,
  getInvitation,
  getInvitations,
  acceptInvitation,
  rejectInvitation,
  removeInvitation,
  createInvitation,
  signIn,
  signOut
}

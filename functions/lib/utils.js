const { Firestore, FieldValue } = require('@google-cloud/firestore')
const { OAuth2Client } = require('google-auth-library')
const jwt = require('jsonwebtoken')

const COOKIE_KEY = 'woc-session'

function getFirestore () {
  return new Firestore({
    projectId: process.env.GCLOUD_PROJECT,
    credentials: {
      client_email: process.env.GCLOUD_CLIENT_EMAIL,
      private_key: process.env.GCLOUD_PRIVATE_KEY.replace(/\\n/g, '\n')
    }
  })
}

function getCookieValue (key, cookies) {
  const rawCookies = cookies.split('; ')
  const foundCookie = rawCookies.find(el => el.startsWith(key))
  if (foundCookie) {
    return foundCookie.split('=')[1]
  }
  return false
}

async function verifyGoogleTokenFromCookies (cookies) {
  const token = getCookieValue('token', cookies)
  if (!token) throw new Error('No token found in cookies')
  const client = new OAuth2Client(process.env.SNOWPACK_PUBLIC_GAPI_CLIENT_ID)
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.SNOWPACK_PUBLIC_GAPI_CLIENT_ID
  })
  return ticket.getPayload()
}

function startSession (user) {
  const { exp, ...rest } = user
  return jwt.sign(rest, process.env.JWT_SECRET, { expiresIn: '90d' })
}

function getSession (token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}

function getUserFromCookies (cookies) {
  const token = getCookieValue(COOKIE_KEY, cookies)
  return getSession(token)
}

async function getCars (userId) {
  const firestore = getFirestore()
  const carsQuery = firestore.collection('cars').where('users', 'array-contains', userId)

  const carsSnapshot = await carsQuery.get()

  if (carsSnapshot._size === 0) {
    return []
  }

  const cars = []

  carsSnapshot.forEach(car => {
    cars.push({
      id: car.id,
      name: car.get('name'),
      isMine: car.get('owner') === userId
    })
  })

  return cars
}

async function addCar ({ userId, name }) {
  const firestore = getFirestore()
  firestore.collection('cars').doc().set({ name, owner: userId, users: [userId] })
}

async function removeCar ({ userId, id }) {
  const firestore = getFirestore()
  const carRef = await firestore.collection('cars').doc(id)
  const carSnapshot = await carRef.get()
  const car = carSnapshot.data()

  if (car.owner === userId) {
    return await carRef.delete()
  }

  if (car.users.includes(userId)) {
    return await carRef.update({ users: car.users.filter(user => user !== userId) })
  }
}

async function renameCar ({ userId, id, name }) {
  const firestore = getFirestore()
  const doc = await firestore.collection('cars').doc(id)
  const carSnapshot = await doc.get()
  const car = carSnapshot.data()

  if (car.users.includes(userId)) {
    await doc.update({ name })
  }
}

async function getLocations (id) {
  const firestore = getFirestore()
  const locationsRef = firestore.collection('cars').doc(id).collection('locations')
  const locationsSnapshot = await locationsRef.get()

  const locations = []
  locationsSnapshot.forEach(location => {
    locations.push({
      ...location.data(),
      id: location.id
    })
  })

  return locations
}

async function removeLocation ({ carId, locationId }) {
  const firestore = getFirestore()
  const locationRef = firestore.doc(`cars/${carId}/locations/${locationId}`)
  await locationRef.delete()
}

async function addLocation ({ userName, carId, geo }) {
  const firestore = getFirestore()
  await firestore.collection(`cars/${carId}`).collection('locations').doc().set({
    userName,
    geo,
    date: new Date()
  })
}

async function getInvitation ({ userEmail, id }) {
  const firestore = getFirestore()
  const inviteRef = firestore.doc(`/invitations/${id}`)
  const inviteSnapshot = await inviteRef.get()
  const invitation = inviteSnapshot.data()
  if (invitation && invitation.to === userEmail && invitation.status === 'pending') {
    return invitation
  }
  return false
}

async function getInvitations (carId) {
  const firestore = getFirestore()
  const invitationsQuery = firestore.collection('invitations')
    .where('carId', '==', carId)
    .where('status', 'in', ['pending', 'accepted'])

  const invitationsSnapshot = await invitationsQuery.get()

  if (invitationsSnapshot._size === 0) {
    return []
  }

  const invitations = []

  invitationsSnapshot.forEach(invitation => {
    invitations.push({
      id: invitation.id,
      to: invitation.get('to')
    })
  })

  return invitations
}

async function updateInvite ({ status, id, userId }) {
  const firestore = getFirestore()
  const inviteRef = firestore.doc(`/invitations/${id}`)
  const inviteSnapshot = await inviteRef.get()
  if (inviteSnapshot.exists) {
    await inviteRef.update({ status })
    const carId = inviteSnapshot.get('carId')
    const carRef = firestore.doc(`/cars/${carId}`)
    const carSnapshot = await carRef.get()
    if (carSnapshot.exists) {
      if (status === 'accepted') {
        await inviteRef.update({ toId: userId })
        await carRef.update({
          users: FieldValue.arrayUnion(userId)
        })
      } else if (status === 'stopped') {
        const toId = await inviteSnapshot.get('toId')
        if (toId) {
          await carRef.update({
            users: FieldValue.arrayRemove(toId)
          })
        }
        await inviteRef.delete()
      } else if (status === 'rejected') {
        await inviteRef.delete()
      }
    }
    return true
  }
  throw new Error('Invite doesn\'t exist')
}

async function addInvite ({ to, carId, carName, from }) {
  const status = 'pending'
  const firestore = getFirestore()
  return await firestore.collection('invitations').doc().set({ to, carId, carName, from, status })
}

module.exports = {
  getFirestore,
  getCookieValue,
  verifyGoogleTokenFromCookies,
  getCars,
  addCar,
  removeCar,
  renameCar,
  getLocations,
  removeLocation,
  addLocation,
  getInvitation,
  getInvitations,
  updateInvite,
  addInvite,
  startSession,
  // endSession,
  getSession,
  COOKIE_KEY,
  getUserFromCookies
}

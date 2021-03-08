const { Firestore, FieldValue } = require('@google-cloud/firestore')
const { OAuth2Client } = require('google-auth-library')

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

async function verifyUser (token) {
  const client = new OAuth2Client(process.env.SNOWPACK_PUBLIC_GAPI_CLIENT_ID)
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.SNOWPACK_PUBLIC_GAPI_CLIENT_ID
  })
  return ticket.getPayload()
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
      ...car.data(),
      id: car.id
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
  await firestore.collection(`cars/${carId}/locations`).doc().set({
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

async function updateInvite ({ status, id, userId }) {
  const firestore = getFirestore()
  const inviteRef = firestore.doc(`/invitations/${id}`)
  const inviteSnapshot = await inviteRef.get()
  if (inviteSnapshot.exists) {
    await inviteRef.update({ status, toId: id })
    if (status === 'accepted') {
      const carId = inviteSnapshot.get('carId')
      const carRef = firestore.doc(`/cars/${carId}`)
      const carSnapshot = await carRef.get()
      if (carSnapshot.exists) {
        await carRef.update({
          users: FieldValue.arrayUnion(userId)
        })
      }
    }
    return true
  }
  throw new Error('Invite doesn\'t exist')
}

module.exports = {
  getFirestore,
  getCookieValue,
  verifyUser,
  getCars,
  addCar,
  removeCar,
  renameCar,
  getLocations,
  removeLocation,
  addLocation,
  getInvitation,
  updateInvite
}

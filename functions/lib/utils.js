const { Firestore } = require('@google-cloud/firestore')
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
      id: car.id,
      name: car.get('name'),
      locations: []
    })
  })

  await Promise.all(cars.map(async car => {
    const locationsQuery = firestore.collection('locations').where('car', '==', car.id)
    const locationsSnapshot = await locationsQuery.select('date', 'geo', 'user').get()

    locationsSnapshot.forEach(location => {
      car.locations.push(location.data())
    })
  }))

  return cars
}

async function addCar ({ userId, name }) {
  const firestore = getFirestore()
  firestore.collection('cars').doc().set({ name, users: [userId] })
}

async function removeCar ({ userId, id }) {
  const firestore = getFirestore()
  const doc = await firestore.collection('cars').doc(id)
  const carSnapshot = await doc.get()
  const car = carSnapshot.data()

  if (car.users.includes(userId)) {
    if (car.users.length === 1) {
      await doc.delete()
    } else {
      await doc.update({ users: car.users.filter(user => user !== userId) })
    }
  }
}

module.exports = {
  getFirestore,
  getCookieValue,
  verifyUser,
  getCars,
  addCar,
  removeCar
}

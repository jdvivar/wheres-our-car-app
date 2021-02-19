// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const { getFirestore } = require('./lib/utils.js')

const handler = async (event, context) => {
  // console.log(context)
  // console.log(event)
  if (!event.queryStringParameters.user) {
    return {
      statusCode: 404,
      headers: {
        explanation: 'Missing query parameter user'
      }
    }
  }

  const { user } = event.queryStringParameters

  try {
    const firestore = getFirestore()
    const carsQuery = firestore.collection('cars').where('users', 'array-contains', user)

    const carsSnapshot = await carsQuery.get()

    if (carsSnapshot._size === 0) {
      return {
        statusCode: 204,
        headers: {
          explanation: 'This user has no cars'
        }
      }
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

    return {
      statusCode: 200,
      body: JSON.stringify(cars)
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }

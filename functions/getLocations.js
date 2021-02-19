// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const { getFirestore } = require('./lib/utils.js')

const handler = async (event, context) => {
  if (!event.queryStringParameters.car) {
    return {
      statusCode: 404,
      headers: {
        explanation: 'Missing query parameter car'
      }
    }
  }

  const { car } = event.queryStringParameters

  try {
    const firestore = getFirestore()
    const locationsQuery = firestore.collection('locations').where('car', '==', car)

    const locationsSnapshot = await locationsQuery.get()

    if (locationsSnapshot._size === 0) {
      return {
        statusCode: 204,
        headers: {
          explanation: 'This car has no locations'
        }
      }
    }

    const locations = []

    locationsSnapshot.forEach(location => {
      locations.push({
        date: location.get('date'),
        geo: location.get('geo'),
        user: location.get('user')
      })
    })

    return {
      statusCode: 200,
      body: JSON.stringify(locations)
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }

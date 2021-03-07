const { getCookieValue, verifyUser, getLocations, addLocation, removeLocation } = require('./lib/utils.js')

const handler = async (event, context) => {
  let user

  try {
    const token = getCookieValue('token', event.headers.cookie)
    user = await verifyUser(token)
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify(error)
    }
  }

  try {
    const userName = user.name
    if (event.httpMethod === 'GET') {
      const { id } = event.queryStringParameters
      if (id) {
        const locations = await getLocations(id)
        if (locations.length === 0) {
          return {
            statusCode: 204,
            headers: {
              explanation: 'This car has no locations'
            }
          }
        }
        return {
          statusCode: 200,
          body: JSON.stringify(locations)
        }
      } else {
        return {
          statusCode: 400,
          headers: {
            explanation: 'You need to provide a carId with id param'
          }
        }
      }
    } else if (event.httpMethod === 'POST') {
      const { carId, geo } = JSON.parse(event.body)
      await addLocation({ userName, carId, geo })
      return {
        statusCode: 200
      }
    } else if (event.httpMethod === 'DELETE') {
      const { carId, location } = JSON.parse(event.body)
      await removeLocation({ carId, location })
      return {
        statusCode: 200
      }
    } else {
      return {
        statusCode: 405
      }
    }
  } catch (error) {
    console.log(error.toString())
    return {
      statusCode: 500,
      body: error.toString()
    }
  }
}

module.exports = { handler }

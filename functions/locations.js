const { getCookieValue, verifyUser, addLocation, removeLocation } = require('./lib/utils.js')

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
    if (event.httpMethod === 'POST') {
      const { carId, geo } = JSON.parse(event.body)
      await addLocation({ userName, carId, geo })
      return {
        statusCode: 200
      }
    } else if (event.httpMethod === 'DELETE') {
      const id = JSON.parse(event.body).id
      await removeLocation({ id })
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

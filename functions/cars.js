const { getCookieValue, verifyUser, getCars, addCar } = require('./lib/utils.js')

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

  if (event.httpMethod === 'GET') {
    try {
      const userId = user.sub
      const cars = await getCars(userId)
      if (cars.length === 0) {
        return {
          statusCode: 204,
          headers: {
            explanation: 'This user has no cars'
          }
        }
      }
      return {
        statusCode: 200,
        body: JSON.stringify(cars)
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: error.toString()
      }
    }
  } else if (event.httpMethod === 'POST') {
    try {
      const userId = user.sub
      const name = JSON.parse(event.body).name
      await addCar({ userId, name })
      return {
        statusCode: 200
      }
    } catch (error) {
      console.log(error.toString())
      return {
        statusCode: 500,
        body: error.toString()
      }
    }
  } else {
    return {
      statusCode: 405
    }
  }
}

module.exports = { handler }

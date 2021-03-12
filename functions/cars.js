const { getCars, addCar, removeCar, renameCar, COOKIE_KEY, getCookieValue, getSession } = require('./lib/utils.js')

const handler = async (event, context) => {
  let user

  try {
    // const start = process.hrtime()
    const id = getCookieValue(COOKIE_KEY, event.headers.cookie)
    user = await getSession(id)
    // const diff = process.hrtime(start)
    // console.log(`\nauth took ${diff[0] * 1e3 + diff[1] / 1000000}ms\n`)
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify(error)
    }
  }

  try {
    const userId = user.sub
    if (event.httpMethod === 'GET') {
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
    } else if (event.httpMethod === 'POST') {
      const name = JSON.parse(event.body).name
      await addCar({ userId, name })
      return {
        statusCode: 200
      }
    } else if (event.httpMethod === 'DELETE') {
      const id = JSON.parse(event.body).id
      await removeCar({ userId, id })
      return {
        statusCode: 200
      }
    } else if (event.httpMethod === 'PATCH') {
      const id = JSON.parse(event.body).id
      const name = JSON.parse(event.body).name
      await renameCar({ userId, id, name })
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

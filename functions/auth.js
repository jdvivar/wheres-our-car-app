const { verifyUser, startSession, getCookieValue, endSession, COOKIE_KEY } = require('./lib/utils.js')

const handler = async (event, context) => {
  try {
    if (event.httpMethod === 'GET') {
      if (event.path.includes('signin')) {
        try {
          const user = await verifyUser(event.headers.cookie)
          const id = await startSession(user)
          return {
            statusCode: 202,
            headers: {
              'Set-Cookie': `${COOKIE_KEY}=${id}; Path=/`
            }
          }
        } catch (error) {
          return {
            statusCode: 401,
            body: JSON.stringify(error)
          }
        }
      } else if (event.path.includes('signout')) {
        const id = getCookieValue(COOKIE_KEY, event.headers.cookie)
        console.log({ id })
        await endSession(id)
        return {
          statusCode: 202,
          headers: {
            'Set-Cookie': `${COOKIE_KEY}=; Path=/`
          }
        }
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

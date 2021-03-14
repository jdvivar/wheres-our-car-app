const { verifyGoogleTokenFromCookies, startSession, COOKIE_KEY } = require('./lib/utils.js')

const handler = async (event, context) => {
  try {
    if (event.httpMethod === 'GET') {
      if (event.path.includes('signin')) {
        try {
          const user = await verifyGoogleTokenFromCookies(event.headers.cookie)
          const token = startSession(user)
          return {
            statusCode: 202,
            headers: {
              'Set-Cookie': `${COOKIE_KEY}=${token}; Path=/`
            }
          }
        } catch (error) {
          return {
            statusCode: 401,
            body: JSON.stringify(error)
          }
        }
      } else if (event.path.includes('signout')) {
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

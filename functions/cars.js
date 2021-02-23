const { getCookieValue, verifyUser, getCars } = require('./lib/utils.js')

const handler = async (event, context) => {
  let user

  try {
    const token = getCookieValue('token', event.headers.cookie)
    user = await verifyUser(token)
  } catch {
    return {
      statusCode: 403
    }
  }

  if (event.httpMethod === 'GET') {
    try {
      const userId = user.sub
      return {
        statusCode: 200,
        body: JSON.stringify(await getCars(userId))
      }
    } catch (error) {
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

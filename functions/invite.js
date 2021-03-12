const {
  getCookieValue,
  getSession,
  COOKIE_KEY,
  getInvitation,
  getInvitations,
  updateInvite,
  addInvite
} = require('./lib/utils.js')

const handler = async (event, context) => {
  let user

  try {
    const id = getCookieValue(COOKIE_KEY, event.headers.cookie)
    user = await getSession(id)
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify(error)
    }
  }

  try {
    const userEmail = user.email
    const userName = user.name
    const userId = user.sub
    const refererURL = new URL(event.headers.referer)
    const params = new URLSearchParams(refererURL.search)
    const id = params.get('invite')
    const { forId } = event.queryStringParameters
    if (event.httpMethod === 'GET') {
      if (!id && !forId) {
        return {
          statusCode: 404,
          headers: {
            explanation: 'No invite id or forId'
          }
        }
      }
      if (id) {
        const invitation = await getInvitation({ userEmail, id })
        if (!invitation) {
          return {
            statusCode: 204,
            headers: {
              explanation: 'This user hasn\'t got any invitation'
            }
          }
        }
        return {
          statusCode: 200,
          body: JSON.stringify(invitation)
        }
      } else if (forId) {
        const invitations = await getInvitations(forId)
        if (!invitations.length) {
          return {
            statusCode: 204,
            headers: {
              explanation: 'This car hasn\'t got any invitations'
            }
          }
        }
        return {
          statusCode: 200,
          body: JSON.stringify(invitations)
        }
      }
    } else if (event.httpMethod === 'PATCH') {
      const { status } = JSON.parse(event.body)
      await updateInvite({ status, id, userId })
      return {
        statusCode: 200
      }
    } else if (event.httpMethod === 'DELETE') {
      const { status, id } = JSON.parse(event.body)
      await updateInvite({ status, id, userId })
      return {
        statusCode: 200
      }
    } else if (event.httpMethod === 'POST') {
      const { to, carId, carName } = JSON.parse(event.body)
      await addInvite({ to, carId, carName, from: userName })
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

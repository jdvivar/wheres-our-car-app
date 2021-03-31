const fetch = require('node-fetch')

const handler = async (event, context) => {
  try {
    const response = await fetch('https://widget.cloudinary.com/v2.0/global/all.js')
    const body = await response.text()
    return {
      statusCode: 200,
      body,
      headers: {
        'Content-type': 'text/javascript'
      }
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    }
  }
}

module.exports = { handler }

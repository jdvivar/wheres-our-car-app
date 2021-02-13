// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
// const { Firestore } = require('@google-cloud/firestore')

const handler = async (event, context) => {
  // console.log('event', event)
  // console.log('context', context)
  try {
    // const firestore = new Firestore()

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Hello' })
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }

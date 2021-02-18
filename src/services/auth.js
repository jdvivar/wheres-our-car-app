const { SNOWPACK_PUBLIC_GAPI_CLIENT_ID } = import.meta.env

async function gapiCheck () {
  if (window.gapi) {
    return new Promise((resolve, reject) => {
      window.gapi.load('client:auth2', { callback: resolve, onerror: reject })
    })
  } else {
    return Promise.reject(new Error('Google API not available for load'))
  }
}

async function setup () {
  await gapiCheck()
  return await window.gapi.auth2.init({
    client_id: SNOWPACK_PUBLIC_GAPI_CLIENT_ID
  })
}

function isSignedIn (auth) {
  return auth.isSignedIn.get()
}

async function signInAuth (auth) {
  await auth.signIn()
  // const { id_token } = user.getAuthResponse()
  // console.log('id_token', id_token)
}

async function signOutAuth (auth) {
  await auth.signOut()
}

function getName (auth) {
  return auth.currentUser.get().getBasicProfile().getName()
}

function getEmail (auth) {
  return auth.currentUser.get().getBasicProfile().getEmail()
}

export {
  setup,
  getName,
  getEmail,
  isSignedIn,
  signInAuth,
  signOutAuth
}

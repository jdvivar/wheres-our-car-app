const { SNOWPACK_PUBLIC_GAPI_CLIENT_ID } = import.meta.env

let auth

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
  auth = await window.gapi.auth2.init({
    client_id: SNOWPACK_PUBLIC_GAPI_CLIENT_ID
  })
  return auth
}

function isSignedIn () {
  return auth.isSignedIn.get()
}

async function signIn () {
  const user = await auth.signIn()
  // const { id_token } = user.getAuthResponse()
  // console.log('id_token', id_token)
  return user
}

async function signOut () {
  return await auth.signOut()
}

function getUserName () {
  return auth.currentUser.get().getBasicProfile().getName()
}

export {
  setup,
  isSignedIn,
  signIn,
  signOut,
  getUserName
}

import { wocState } from '../state.js'

const { SNOWPACK_PUBLIC_GAPI_CLIENT_ID } = import.meta.env
let auth = false

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
  if (!auth) {
    auth = await window.gapi.auth2.init({
      client_id: SNOWPACK_PUBLIC_GAPI_CLIENT_ID
    })
  }
  return auth
}

async function isSignedIn () {
  try {
    if (!auth) {
      await setup()
    }
  } catch {
    return false
  }
  return auth.isSignedIn.get()
}

async function signIn () {
  const user = await auth.signIn()
  wocState.signInOut(true)
  // const { id_token } = user.getAuthResponse()
  // console.log('id_token', id_token)
  return user
}

async function signOut () {
  await auth.signOut()
  wocState.signInOut(false)
  return true
}

function getUserName () {
  if (!auth) {
    return ''
  }
  return auth.currentUser.get().getBasicProfile().getName()
}

function getEmail () {
  if (!auth) {
    return ''
  }
  return auth.currentUser.get().getBasicProfile().getEmail()
}

export {
  setup,
  isSignedIn,
  signIn,
  signOut,
  getUserName,
  getEmail
}

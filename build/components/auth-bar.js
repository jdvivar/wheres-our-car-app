const asyncGApiLoad = async () => {
  if (window.gapi) {
    return new Promise((resolve, reject) => {
      window.gapi.load('client:auth2', { callback: resolve, onerror: reject })
    })
  } else {
    return Promise.reject(new Error('Google API not available for load'))
  }
}
async function mounted () {
  try {
    // Load Google API
    await asyncGApiLoad()
    // Init auth instance
    const googleAuth = await window.gapi.auth2.init({
      client_id: '1038655217384-0rhqt27ednkdocn1rgevbjtolsckh0ls.apps.googleusercontent.com'
    })
    // Attach handler to button
    googleAuth.attachClickHandler(document.getElementById('sign-in'), {},
      user => {
        console.log(user)
      },
      error => {
        console.log(error)
      }
    )
    // If user is already logged in
    if (googleAuth.isSignedIn.get()) {
      console.log('already loggedin', googleAuth.currentUser.get())
    }
  } catch (error) {
    console.log(error)
  }
}
mounted()

document.getElementById('log-out').addEventListener('click', async () => {
  console.log(await window.gapi.auth2.getAuthInstance().signOut())
})

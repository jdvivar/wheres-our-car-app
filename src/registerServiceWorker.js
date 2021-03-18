if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
    navigator.serviceWorker.addEventListener('message', (e) => {
      console.log(e)
    })
  })
}

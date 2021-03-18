import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'
import { BroadcastUpdatePlugin } from 'workbox-broadcast-update'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate({
    plugins: [
      new BroadcastUpdatePlugin()
    ]
  })
)

const cacheName = 'static-resources'
const matchCallback = ({ request }) =>
  request.destination === 'style' ||
  request.destination === 'script' ||
  request.destination === 'worker'

registerRoute(
  matchCallback,
  new StaleWhileRevalidate({
    cacheName,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200, 204]
      })
    ]
  })
)

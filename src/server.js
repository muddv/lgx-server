import { Server } from '@logux/server'

import { SUBPROTOCOL } from './protocol.js'

// Server

const server = new Server(
  Server.loadOptions(process, {
    subprotocol: SUBPROTOCOL,
    supports: SUBPROTOCOL,
    fileUrl: import.meta.url
  })
)

// Authentificator

server.auth(({ userId, cookie }) => {
  if (userId === '10') {
    return true
  } else {
    return cookie['token'] === 'good'
  }
})

server.autoloadModules()

server.listen()

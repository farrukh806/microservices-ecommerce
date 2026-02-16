import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()
const PORT = 8002

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

serve({
  fetch: app.fetch,
  port: PORT
}, (info) => {
  console.log(`Payment service is running on ${info.port}`)
})

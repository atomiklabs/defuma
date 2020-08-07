import path from 'path'
import Koa from 'koa'
import websockify from 'koa-websocket'
import serve from 'koa-static'
import dotenv from 'dotenv'
import wss from './wss'

dotenv.config()
if (!process.env.USER_API_KEY || !process.env.USER_API_SECRET) console.log('Missing hub keys...')

const PORT = process.env.PORT || 3001
const app = websockify(new Koa())

app.ws.use(wss)

app.use(serve(path.join(__dirname, '../build')))

app.listen(PORT, () => console.log('Web-ui server started on ' + PORT))

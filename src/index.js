import { configDotenv } from 'dotenv'
import express, { json, urlencoded } from 'express'
import cors from 'cors'
import { index_routes } from './routes/index.js'

configDotenv()

const app = express()
const port = process.env.EXPRESS_PORT || 5010

app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use('/api', index_routes)

app.post('/eventRcv', (request, response) => {
    console.log('==================================================')
    console.log(`[${new Date().toISOString()}] Evento Recibido:`)
    console.log('==================================================')
    console.log('HEADERS:\n', JSON.stringify(request.headers, null, 2))
    console.log('\nBODY:\n', JSON.stringify(request.body, null, 2))
    console.log('\EVENTS:\n', JSON.stringify(request.body.params.events, null, 2))
    console.log('==================================================\n\n')

    response.status(200).send({ status: 'ok', message: 'Event received and logged to console.' });
})

app.get('/test', (request, response) => {
    response.status(200).json({ message: 'Test endpoint is working!' })
})

app.listen(port, () => {
    console.log(`La marrana esta viva en el puerto: ${port}`)
})
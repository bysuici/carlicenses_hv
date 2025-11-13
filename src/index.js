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
    try {
        console.log('==================================================')
        console.log(`[${new Date().toISOString()}] Evento Recibido:`)
        console.log('==================================================')

        console.log('HEADERS:')
        console.dir(request.headers, { depth: null, colors: true })

        console.log('\nBODY:')
        console.dir(request.body, { depth: null, colors: true })

        const events = request.body?.params?.events

        if (events) {
            console.log('\nEVENTS:')
            console.dir(events, { depth: null, colors: true })
        } else {
            console.log('\nEVENTS: No events in params')
        }

        console.log('==================================================\n\n')
    } catch (error) {
        console.error('Error procesando el log:', error.message)
    }
    response.status(200).send({ status: 'ok', message: 'Event received' });
})

app.get('/test', (request, response) => {
    response.status(200).json({ message: 'Test endpoint is working!' })
})

app.listen(port, () => {
    console.log(`La marrana esta viva en el puerto: ${port}`)
})
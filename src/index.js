import { configDotenv } from 'dotenv'
import express, { json, response, urlencoded } from 'express'
import cors from 'cors'
import axios from 'axios'
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

app.post('/eventRcv', async (request, response) => {
    try {
        const events = request.body?.params?.events
        // if (events) {
        //     console.log('\nBODY:')
        //     console.dir(request.body, { depth: null, colors: true })
        // } else {
        //     console.log('\nEVENTS: No events in params')
        // }

        try {
            // COVIA Endpoint Placas
            const backendCoviaResponse = await axios.post(`https://api-covia.okip.com.mx/plate-event`, request.body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            // Bitacora Endpoint Placas
            const backendBitacoraResponse = await axios.post(`https://api-bitacora.okip.com.mx/api/event/plates`, request.body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            // Fan ID Endpoint Placas
            const backendFanIDResponse = await axios.post(`https://fanid-okip.okip.com.mx/api/v1/hikvision/events/plates/listener`, { body: request.body })
        } catch (axiosError) {
            console.log('evento:', request.body)
            console.error('Error enviando evento al backend principal:', axiosError.message)
        }

        response.status(200).send({ status: 'ok', message: 'Event received' })
    } catch (error) {
        console.error('Error procesando el log:', error.message)
        response.status(500).send({ status: 'error', message: 'Internal error' })
    }
})

// NUEVOS EVENTOS
app.post('/new/events', (request, response) => {
    try {
        console.log('==================================================')
        console.log(`[${new Date().toISOString()}] Evento Recibido de Person:`)
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

// TORNIQUETE
app.post('/event/200518', async (request, response) => {
    const events = request.body?.params?.events[0]

    // Bitacora Endpoint Torniquetes
    try {
        await axios.post(`https://api-bitacora.okip.com.mx/api/event/torniquete/200518`, events, { headers: { 'Content-Type': 'application/json' } })
    } catch (axiosError) {
        console.log('evento:', request.body)
        console.error('Error enviando evento al backend principal:', axiosError.message)
    }

    // Fan ID Endpoint Torniquetes
    try {
        await axios.post('https://fanid-okip.okip.com.mx/api/v1/hikvision/events/torniquete/listener', { data: events })
    } catch (error) {
        console.error('Error enviando evento TORNIQUETE al backend FanID:', error.message)
    }

    response.status(200).send({ status: 'ok', message: 'Event received' })
})

// BIOMETRICO
app.post('/event/196893', async (request, response) => {
    const events = request.body?.params?.events[0]

    // Bitacora Endpoint Biometrico
    try {
        await axios.post(`https://api-bitacora.okip.com.mx/api/event/torniquete/196893`, events, { headers: { 'Content-Type': 'application/json' } })
    } catch (axiosError) {
        console.log('evento:', request.body)
        console.error('Error enviando evento al backend principal:', axiosError.message)
    }

    // Fan ID Endpoint Biometrico
    try {
        await axios.post('https://fanid-okip.okip.com.mx/api/v1/hikvision/events/access/listener', events)
    } catch (error) {
        console.error('Error enviando evento BIOMETRICO al backend FanID:', error.message)
    }

    response.status(200).send({ status: 'ok', message: 'Event received' })
})

// PUERTAS POR HUELLA
app.post('/event/197127', async (request, response) => {
    const events = request.body?.params?.events[0]

    // Bitacora Endpoint Biometrico poe Huella
    try {
        await axios.post(`https://api-bitacora.okip.com.mx/api/event/doors/197127`, events, { headers: { 'Content-Type': 'application/json' } })
    } catch (axiosError) {
        console.log('evento:', request.body)
        console.error('Error enviando evento al backend principal:', axiosError.message)
    }

    // Fan ID Endpoint Biometrico
    try {
        await axios.post('https://fanid-okip.okip.com.mx/api/v1/hikvision/events/doors/listener', events)
    } catch (error) {
        console.error('Error enviando evento PUERTAS POR HUELLA al backend FanID:', error.message)
    }

    response.status(200).send({ status: 'ok', message: 'Event received' })
})

// ABRIR PUERTAS CON TARJETA
app.post('/event/198914', async (request, response) => {
    const events = request.body?.params?.events[0]

    // Bitacora Endpoint Puertas por Tarjeta
    try {
        await axios.post(`https://api-bitacora.okip.com.mx/api/event/doors/198914`, events, { headers: { 'Content-Type': 'application/json' } })
    } catch (axiosError) {
        console.log('evento:', request.body)
        console.error('Error enviando evento al backend principal:', axiosError.message)
    }

    // Fan ID Endpoint Puertas por Tarjeta
    try {
        await axios.post('https://fanid-okip.okip.com.mx/api/v1/hikvision/events/cards/listener', events)
    } catch (error) {
        console.error('Error enviando evento ABRIR PUERTAS CON TARJETA al backend FanID:', error.message)
    }

    response.status(200).send({ status: 'ok', message: 'Event received' })
})

app.listen(port, () => {
    console.log(`La marrana esta viva en el puerto: ${port}`)
})
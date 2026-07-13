import { configDotenv } from 'dotenv'
import express, { json, request, response, urlencoded } from 'express'
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
// app.use(express.text({ type: 'text/plain' }));

app.use('/api', index_routes)

// NUEVOS EVENTOS
// app.post('/new/events', (request, response) => {
//     try {
//         console.log('==================================================')
//         console.log(`[${new Date().toISOString()}] Evento Recibido de Person:`)
//         console.log('==================================================')

//         console.log('HEADERS:')
//         console.dir(request.headers, { depth: null, colors: true })

//         console.log('\nBODY:')
//         console.dir(request.body, { depth: null, colors: true })

//         console.log('==================================================\n\n')
//     } catch (error) {
//         console.error('Error procesando el log:', error.message)
//     }
//     response.status(200).send({ status: 'ok', message: 'Event received' });
// })

// EVENTOS DE PLACAS
app.post('/eventRcv', async (request, response) => {
    const events = request.body?.params?.events

    // COVIA
    try {
        await axios.post(
            `https://api-covia.okip.com.mx/plate-event`,
            request.body,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (axiosError) {
        console.error('Error enviando evento al backend principal:', axiosError.message)
    }

    // Bitacora
    try {
        await axios.post(
            `https://api-bitacora.okip.com.mx/api/event/plates`,
            request.body,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (axiosError) {
        console.error('Error enviando evento al backend principal:', axiosError.message)
    }

    // RIA
    try {
        await axios.post(
            `https://api-ria.okip.com.mx/api/v1/hikvision/events/plates/listener`,
            request.body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-webhook-secret': '366977693916357e652b3cf0c4d40d7fde28208a211d52ebf9a08f39f7a0956d'
                }
            }
        )
    } catch (axiosError) {
        console.error('Error enviando evento al backend principal:', axiosError.message)
    }

    // RIA QA
    try {
        await axios.post(
            `https://qa-api-ria.okip.com.mx/api/v1/hikvision/events/plates/listener`,
            request.body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-webhook-secret': '366977693916357e652b3cf0c4d40d7fde28208a211d52ebf9a08f39f7a0956d'
                }
            }
        )
    } catch (error) {
        console.error('Error enviando evento al backend principal placas RIA QA:', error.message)
    }

    response.status(200).send({ status: 'ok', message: 'Event received' })
})

// TORNIQUETE
app.post('/event/200518', async (request, response) => {
    const events = request.body?.params?.events[0]

    // Bitacora
    try {
        await axios.post(
            `https://api-bitacora.okip.com.mx/api/event/torniquete/200518`,
            events,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (axiosError) {
        console.error('Error enviando evento al backend principal torniquete:', axiosError.message)
    }

    // RIA
    try {
        await axios.post(
            'https://api-ria.okip.com.mx/api/v1/hikvision/events/torniquete/listener',
            events,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-webhook-secret': '366977693916357e652b3cf0c4d40d7fde28208a211d52ebf9a08f39f7a0956d'
                }
            }
        )
    } catch (error) {
        console.error('Error enviando evento TORNIQUETE al backend FanID:', error.message)
    }

    // RIA QA
    try {
        await axios.post(
            'https://qa-api-ria.okip.com.mx/api/v1/hikvision/events/torniquete/listener',
            events,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-webhook-secret': '366977693916357e652b3cf0c4d40d7fde28208a211d52ebf9a08f39f7a0956d'
                }
            }
        )
    } catch (error) {
        console.error('Error enviando evento TORNIQUETE al backend FanID:', error.message)
    }

    response.status(200).send({ status: 'ok', message: 'Event received' })
})

// BIOMETRICO
app.post('/event/196893', async (request, response) => {
    const events = request.body?.params?.events[0]

    // Bitacora
    try {
        await axios.post(
            `https://api-bitacora.okip.com.mx/api/event/torniquete/196893`,
            events,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (axiosError) {
        console.error('Error enviando evento al backend principal biometrico:', axiosError.message)
    }

    // RIA
    try {
        await axios.post(
            'https://api-ria.okip.com.mx/api/v1/hikvision/events/access/listener',
            events,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-webhook-secret': '366977693916357e652b3cf0c4d40d7fde28208a211d52ebf9a08f39f7a0956d'
                }
            }
        )
    } catch (error) {
        console.error('Error enviando evento BIOMETRICO al backend FanID:', error.message)
    }

    // RIA QA
    try {
        await axios.post(
            'https://qa-api-ria.okip.com.mx/api/v1/hikvision/events/access/listener',
            events,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-webhook-secret': '366977693916357e652b3cf0c4d40d7fde28208a211d52ebf9a08f39f7a0956d'
                }
            }
        )
    } catch (error) {
        console.error('Error enviando evento BIOMETRICO al backend FanID:', error.message)
    }

    response.status(200).send({ status: 'ok', message: 'Event received' })
})

// PUERTAS POR HUELLA
app.post('/event/197127', async (request, response) => {
    const events = request.body?.params?.events[0]

    // Bitacora
    try {
        await axios.post(
            `https://api-bitacora.okip.com.mx/api/event/doors/197127`,
            events,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (axiosError) {
        console.error('Error enviando evento al backend principal biometrico poe huella:', axiosError.message)
    }

    // RIA
    try {
        await axios.post(
            'https://api-ria.okip.com.mx/api/v1/hikvision/events/doors/listener',
            events,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-webhook-secret': '366977693916357e652b3cf0c4d40d7fde28208a211d52ebf9a08f39f7a0956d'
                }
            }
        )
    } catch (error) {
        console.error('Error enviando evento PUERTAS POR HUELLA al backend FanID:', error.message)
    }

    // RIA QA
    try {
        await axios.post(
            'https://qa-api-ria.okip.com.mx/api/v1/hikvision/events/doors/listener',
            events,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-webhook-secret': '366977693916357e652b3cf0c4d40d7fde28208a211d52ebf9a08f39f7a0956d'
                }
            }
        )
    } catch (error) {
        console.error('Error enviando evento PUERTAS POR HUELLA al backend FanID:', error.message)
    }

    response.status(200).send({ status: 'ok', message: 'Event received' })
})

// ABRIR PUERTAS CON TARJETA
app.post('/event/198914', async (request, response) => {
    const events = request.body?.params?.events[0]

    // Bitacora
    try {
        await axios.post(
            `https://api-bitacora.okip.com.mx/api/event/doors/198914`,
            events,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (axiosError) {
        console.error('Error enviando evento al backend principal:', axiosError.message)
    }

    // RIA
    try {
        await axios.post(
            'https://api-ria.okip.com.mx/api/v1/hikvision/events/cards/listener',
            events,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-webhook-secret': '366977693916357e652b3cf0c4d40d7fde28208a211d52ebf9a08f39f7a0956d'
                }
            }
        )
    } catch (error) {
        console.error('Error enviando evento ABRIR PUERTAS CON TARJETA al backend FanID:', error.message)
    }

    // RIA QA
    try {
        await axios.post(
            'https://qa-api-ria.okip.com.mx/api/v1/hikvision/events/cards/listener',
            events,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-webhook-secret': '366977693916357e652b3cf0c4d40d7fde28208a211d52ebf9a08f39f7a0956d'
                }
            }
        )
    } catch (error) {
        console.error('Error enviando evento ABRIR PUERTAS CON TARJETA al backend FanID:', error.message)
    }

    response.status(200).send({ status: 'ok', message: 'Event received' })
})

// HikCentral Detección de Movimiento
app.post('/event/motion-detection/131331', async (request, response) => {
    try {
        await axios.post(
            'https://api-covia.okip.com.mx/hikcentral/event/motion-detection',
            request.body,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (axiosError) {
        console.dir('evento 131331:', request.body, { depth: null, colors: true })
        console.error('Error enviando evento al backend principal:', axiosError.message)
    }

    response.status(200).send({ status: 'ok', message: 'Event received' })
})

app.post('/camera-buttom', async (request, response) => {
    try {
        console.log('==================================================')
        console.log(`[${new Date().toISOString()}] Botón de Pánico Activado:`)
        console.log('==================================================')

        console.log('\nBODY:')
        console.dir(request.body, { depth: null, colors: true })

        console.log('==================================================\n\n')

        // COVIA Endpoint Botón de Pánico
        const backendCoviaResponse = await axios.post(`https://api-covia.okip.com.mx/panic-button`, request.body, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        console.log('Respuesta de COVIA:', backendCoviaResponse.data)

        response.status(200).send({ status: 'ok', message: 'Panic button event received' })
    } catch (error) {
        console.error('Error procesando el log del botón de pánico:', error.message)
    }
})

app.listen(port, () => {
    console.log(`La marrana esta viva en el puerto: ${port}`)
})
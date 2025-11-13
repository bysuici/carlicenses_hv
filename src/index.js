import { configDotenv } from 'dotenv'
import express, { json, urlencoded } from 'express'
import cors from 'cors'
// Se eliminó la importación de 'fs/promises' ya que no se usará
import { index_routes } from './routes/index.js'

// Inicialización de las variables de entorno .env
configDotenv()

// Inicializar Express
const app = express()
const port = process.env.EXPRESS_PORT || 5010

// Middlewares para proceso de peticiones
app.use(json())                                     // Permite recibir JSON
app.use(urlencoded({ extended: true }))             // Permite recibir datos codificados en la URL (Forms)

// Configuración de los CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',         // Origenes permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE'],      // Métodos HTTP permitidos
    credentials: true                               // Permite enviar cookies y cabeceras de 'Authentification'
}))

// Rutas principales de la API
app.use('/api', index_routes)

// Endpoint modificado para registrar el evento SOLO en la consola
// Se quitó 'async' ya que no se usan promesas (await)
app.post('/eventRcv', (request, response) => {
    
    // Imprimir el evento en la consola
    console.log('==================================================')
    console.log(`[${new Date().toISOString()}] Evento Recibido:`)
    console.log('==================================================')

    // Imprimir Headers y Body de forma legible
    console.log('HEADERS:\n', JSON.stringify(request.headers, null, 2))
    console.log('\nBODY:\n', JSON.stringify(request.body, null, 2))
    
    // Lógica para imprimir los 'events' si existen
    if (request.body && request.body.events) {
        console.log('\nEvents detectados: ', request.body.events);
    } else {
        console.log('\nEl body no contiene la propiedad "events".');
    }
    console.log('==================================================\n\n')


    // Enviar respuesta exitosa
    // Se envía la respuesta fuera de cualquier try...catch (que ya no existe)
    response.status(200).send({ status: 'ok', message: 'Event received and logged to console.' });

})

app.get('/test', (request, response) => {
    response.status(200).json({ message: 'Test endpoint is working!' })
})

// Incializar el servidor HTTP en el puerto definido o por defecto
app.listen(port, () => {
    console.log(`HTTP Server is ready in port ${port}`)
})
import { configDotenv } from 'dotenv'
import express, { json, urlencoded } from 'express'
import cors from 'cors'
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

// Endpoint modificado para registrar el evento en un archivo
app.post('/eventRcv', async (request, response) => {
    // Definir el nombre del archivo log
    const logFile = 'events.log';

    // Formatear el contenido del log (timestamp, headers y body)
    // Usamos JSON.stringify(..., null, 2) para que el JSON se vea "bonito" y sea legible.
    const logEntry = `
==================================================
[${new Date().toISOString()}] Evento Recibido:
==================================================

HEADERS:
${JSON.stringify(request.headers, null, 2)}

BODY:
${JSON.stringify(request.body, null, 2)}

\n\n`; // Espacio extra para el siguiente log

    try {
        // Escribir (añadir) al archivo log de forma asíncrona
        // 'appendFile' crea el archivo si no existe y añade el contenido al final.
        await appendFile(logFile, logEntry);

        // Informar a la consola que se registró
        console.log(`Evento registrado exitosamente en ${logFile}`);

        // Responder al cliente que todo salió bien
        response.status(200).send({ status: 'success', message: 'Event received and logged.' });

    } catch (err) {
        // Manejar cualquier error durante la escritura del archivo
        console.error('Error al escribir en el archivo log:', err);
        response.status(500).send({ status: 'error', message: 'Internal server error while logging event.' });
    }
})

app.get('/test', (request, response) => {
    response.status(200).json({ message: 'Test endpoint is working!' })
})

// Incializar el servidor HTTP en el puerto definido o por defecto
app.listen(port, () => {
    console.log(`HTTP Server is ready in port ${port}`)
})
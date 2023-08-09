import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'

import connectDB from './mongodb/connect.js'
import userRouter from './routes/user.routes.js'
import buildingRouter from './routes/building.routes.js'
import floorRouter from './routes/floor.routes.js'
import switchRouter from './routes/switch.routes.js'
import portRouter from './routes/port.routes.js'
import logRouter from './routes/log.routes.js'


dotenv.config()

const app = express()


const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }))

app.get('/', (req, res) => {
    res.send({ message: 'Hello World!' })
})

app.use("/api/v1/user", userRouter)
app.use("/api/v1/my-profile", userRouter)
app.use("/api/v1/log", logRouter)
app.use("/api/v1/building", buildingRouter)
app.use("/api/v1/floor", floorRouter)
app.use("/api/v1/switch", switchRouter)
app.use("/api/v1/port", portRouter)

const startServer = async () => {
    try {
        // connect to database
        connectDB(process.env.MONGODB_URL)

        app.listen(8080, () => console.log('Server started on port http://localhost:8080'))

    } catch (error) {
        console.log(error)
    }
}

startServer()
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/authRoutes'
import bookRoutes from './routes/booksRoutes' // Corrected import alias
dotenv.config()

const app = express()
app.use(express.json())

app.use(
  cors({
    origin: '*', // frontend origin
    credentials: false
  })
)

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/book', bookRoutes) // Corrected the alias here

// 🏠 Root route
app.get('/', (_req, res) => {
  res.send(`
    🚀 API is running...
    🌐 Status: Online
  `)
})

export default app

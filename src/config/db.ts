import mongoose from 'mongoose'

const connectDB = async (): Promise<void> => {
  try { 

    await mongoose.connect(process.env.MONGO_URL as string)

    console.log(
      `🔌 Connection State: ${mongoose.connection.readyState === 1 ? '🟢 Connected to database': '🔴 Unable to connect try again'}`
    )
  } catch (error) {
    console.error(
      `❌ Error: ${error instanceof Error ? error.message : String(error)}`
    )
    console.error('🚫 Database connection failed')
    process.exit(1)
  }
}

export default connectDB
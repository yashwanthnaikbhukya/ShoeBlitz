import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const connectionInstance =await mongoose.connect(`mongodb://localhost:27017/shoeblitz`)
        console.log('Database Connected! Host:', connectionInstance.connection.host)
    } catch (error) {
        console.log("❌ Database connection error !!!");
    }
}

export {connectDB}
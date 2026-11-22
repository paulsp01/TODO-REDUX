import mongoose from "mongoose"

async function connectDB(retries = 5, delay = 2000) {
    try {
      console.log("starting mongodb");
        const DbConnection = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Database Connected Successfully,DB HOST: ${DbConnection.connection.host}`);
    } catch (error) {
        console.error("Database Connection Failed", error.message);

    }
}

export default connectDB;
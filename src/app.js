import express from "express"
import cookiParser from "cookie-parser"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import todoRoutes from "./routes/todo.route.js"
import userRoutes from "./routes/user.route.js"

dotenv.config({path:"./.env"})

const app=express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookiParser())

app.disable("x-powered-by")
app.use("/api/v1/todos", todoRoutes)
app.use("/api/v1/users", userRoutes)
connectDB()
const Port=process.env.PORT || 8000
app.listen(Port,()=>{
    console.log(`port is running on ${Port}`);
})


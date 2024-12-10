// require('dotenv').config({path: './env'})


import dotenv from 'dotenv'
import connectDB from './db/index.js'
import {app} from './app.js'

dotenv.config({
    path: './env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log("MongoDB connection failed!!!", error)
}) 








/*

import express from 'express'
const app = express()

( async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`) 
        app.on("error", (error)=>{
            console.log("Unable to connect to DB, Due to Error: ", error)
            throw error
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`Server is live on ${process.env.PORT}`)
        })

    } catch (error){
        console.error('Error: ', error)
        throw error
    }
} )()

*/
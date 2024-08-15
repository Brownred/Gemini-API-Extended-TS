import "dotenv/config"
import express, { NextFunction, Request, Response } from "express";
import cors from "cors"
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import errorHandler from "./middleware/errorHandler";
import { OK } from "./constants/http";
import { geminiRoutes } from "./routes/gemini.route";



const app = express()

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors({origin: APP_ORIGIN, credentials: true})) // Only our front end can access this API
// app.use(cookieParser());


// Add a health check route {IMPORTANT}
app.get("/", (req: Request, res: Response, next:NextFunction) => {

    
    return res.status(OK).json({"status": "healthy"})

})

// AuthRoutes
// GeminiRoutes
app.use("/gemini", geminiRoutes)



// It will catch all the errors that are thrown in any of the routes above. and all of the error hadling logic will live in the middleware
app.use(errorHandler)


app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT} in ${NODE_ENV} mode.`)
    // await connectToDatabase()
})
import { ErrorRequestHandler, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import { z } from "zod";
import multer from "multer";



const handleMulterError = (res: Response, error: multer.MulterError) => {
    console.log(error)
    return res.status(BAD_REQUEST).json({
        error
    })
}


const handleZodError = (res: Response, error: z.ZodError) => {

    // extract the useful error data
    const errors = error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message,
    }))

    return res.status(BAD_REQUEST).json({
        message: error.message,
        errors,
    })
}


const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.log(`*************************************************************`)
    console.log(`PATH: ${req.path}`, error)
    
    // Handle Multer Error
    if (error instanceof multer.MulterError) {
        return handleMulterError(res, error)
    }
    
    // Handle Zod Error
    if (error instanceof z.ZodError) {
        return handleZodError(res, error)
    }


    console.log(`*************************************************************`)
    return res.status(INTERNAL_SERVER_ERROR).send('Internal Server Error')
}

export default errorHandler
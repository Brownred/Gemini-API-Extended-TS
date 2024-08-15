import { NextFunction, Request, Response } from "express"
import { BAD_REQUEST } from "../constants/http"


export default (req: Request, res: Response, next: NextFunction) => {
    if (!req.files) {
        res.sendStatus(BAD_REQUEST)
    }
    
    next()
}
import { Router } from "express";
import { uploadFileHandler, textGenHandler, fileContentGenHandler } from "../controllers/gemini.controller";
import CheckFileValid from "../middleware/CheckFileValid";
import { cpUpload } from "../configs/MulterConfigs";




export const geminiRoutes = Router();



// Prefix: /gemini
geminiRoutes.post("/textGen", textGenHandler)
geminiRoutes.post("/uploadFile", cpUpload, CheckFileValid, uploadFileHandler)
geminiRoutes.post("/fileContent", fileContentGenHandler)
// geminiRoutes.post("/audio", audioHandler)
// geminiRoutes.post("/codeExec", codeExecHandler)
// geminiRoutes.post("/conversation", convoHandler)

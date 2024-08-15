import { GoogleGenerativeAI } from "@google/generative-ai";
// import { GenerateText } from "../utils/types";
import { GEMINI_API_KEY } from "../constants/env";
import { cleanUp, uploadFile } from "./mediaFiles.service";
import { FileMetaData } from "../utils/types";
import { z } from "zod";
import { fileMetaDataSchema } from '../controllers/gemini.controller';


const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);


export const generateText = async (text: string, systemInstruction?: string) => {

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: systemInstruction })
    const prompt = text
    const result = await model.generateContent(prompt)
    return result.response.text()

}


export const generateFileContent = async (text: string, filesMetaData: FileMetaData, systemInstrunction?: string) => {

// From the upload file, a response will be sent to the client containing the files data after they upload the file. so the client will add promt to the generate content endpoint that will come together with the filesMetadata(all metadata object) they uploaded.
    let i = 0
    let filesData = []
    while (filesMetaData[i]){
        filesData.push({
            fileData: {
                mimeType: filesMetaData[i].mimeType,
                fileUri: filesMetaData[i].uri
            }
        })
        i++
    }


    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: systemInstrunction })
    
    const prompt = text

    const result = await model.generateContent([
        ...filesData,
        {
            text: prompt
        }
    ])

    let x = 0
    while (filesMetaData[x]){
        cleanUp(filesMetaData[x].name)
        x++
    } 

    return {response: result.response.text(), usageMetadata: result.response.usageMetadata}
}

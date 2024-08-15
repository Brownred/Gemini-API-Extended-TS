import { CREATED } from "../constants/http";
import { generateFileContent, generateText } from "../services/gemini.service";
import catchErrors from "../utils/catchErrors";
import { z } from "zod"
import { uploadFile } from "../services/mediaFiles.service";

const textSchema = z.object({
    input: z.string(),
    systemInstruction: z.string().optional(),
})


export const fileMetaDataSchema = z.object({
    name: z.string(),
    displayName: z.string(),
    mimeType: z.string(),
    sizeBytes: z.string(),
    createTime: z.string(),
    updateTime: z.string(),
    expirationTime: z.string(),
    sha256Hash: z.string(),
    uri: z.string(),
    state: z.string(),
  });
  
  const responseSchema = z.object({
    message: z.string(),
    filesMetaData: z.array(fileMetaDataSchema),
  });
  
  const fileContentGenSchema = z.object({
    input: z.string(),
    systemInstruction: z.string().optional(),
    response: responseSchema,
  });


export const textGenHandler = catchErrors(async (req, res) => {

    // validate request
    const reqBody = textSchema.parse({
        ...req.body
    })

    // call service
    const response = await generateText(reqBody.input, reqBody.systemInstruction)
    // return Response
    res.status(CREATED).json({response: response})
})



export const uploadFileHandler = catchErrors(async (req, res) => {

    const { files } = req
    
    // res.send("file Uploaded successfully")

    const response = await uploadFile(files['file'])

    res.status(CREATED).json({response})

})




export const fileContentGenHandler = catchErrors(async (req, res) => {


    // Validate Request
    const reqBody = fileContentGenSchema.parse({
        ...req.body
    })

    // call service
    // From the upload file, a response will be sent to the client containing the files data after they upload the file. so the client will add promt to the generate content endpoint that will come together with the filesMetadata(all metadata object) they uploaded.
    const response = await generateFileContent(reqBody.input, reqBody.response.filesMetaData, reqBody.systemInstruction)
    // return Response
    res.status(CREATED).json({response: response})
    
})
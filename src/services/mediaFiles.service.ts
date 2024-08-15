import { GEMINI_API_KEY } from "../constants/env";
import { FileState, GoogleAIFileManager } from "@google/generative-ai/server";

const fileManager = new GoogleAIFileManager(GEMINI_API_KEY)

// Lets start with an image.
// Prepare the image in a specific folder.
// Upload the image with media.upload and specify the display name
export const uploadFile = async (files : Express.Multer.File) => {
    
    let i = 0
    let uploadResults = []
    while (files[i]) {

        const uploadResult = await fileManager.uploadFile(files[i].path, {
            mimeType: files[i].mimetype,
            displayName: files[i].originalname
        })

        // Verify file upload and check state
        const name = uploadResult.file.name;

        // Poll getFile() on a set interval (10 seconds here) to check file state.
        let file = await fileManager.getFile(name);
        while (file.state === FileState.PROCESSING) {
        process.stdout.write(".")
        // Sleep for 10 seconds
        await new Promise((resolve) => setTimeout(resolve, 10_000));
        // Fetch the file from the API again
        file = await fileManager.getFile(name)
        }

        if (file.state === FileState.FAILED) {
        throw new Error("Video processing failed.");
        }


        
        console.log(`Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`)

        uploadResults.push(uploadResult.file)

        i++

    }

    

    return {message: `Uploaded ${i} file`, filesMetaData: uploadResults}
}


export const cleanUp = async (imgName: string) => {
    await fileManager.deleteFile(imgName)
    console.log(`****Cleaned up ${imgName}****`)
}
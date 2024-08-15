import multer from "multer"
import parseFileName from "../utils/parseFileName"
import path from 'path';
import fs from 'fs';



const multerStorage = multer.diskStorage({
    destination(_, file, callback) {
    const {base} = parseFileName(file.originalname)

    fs.promises.mkdir(path.join('tmp/uploads', base), {recursive: true})
    .then(() => {
        callback(null, `tmp/uploads/${base}`)
    })
    },
    filename: (_, file, cb) => (cb(null, `full${parseFileName(file.originalname).ext}`))
})


export const upload = multer({storage: multerStorage})
export const cpUpload = upload.fields([{ name: 'file', maxCount: 5 },])

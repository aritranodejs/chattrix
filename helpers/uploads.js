import path from 'path';
import url from 'url';
import fs from 'fs';

// Multer
import multer from 'multer';

// Jimp
import jimp from 'jimp';

// Custom helper
import { uniqueFileName } from './custom.js'; // Ensure this file has a .js or .mjs extension

const upload = (fields, mimeTypes = [], folder = '') => {
    return multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                let dirPath = 'public/uploads';
                if (file.fieldname === 'avatar') {
                    dirPath += '/profile';
                } else {
                    dirPath += `/${folder}`;
                }

                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true }); // Create the directory recursively
                }
                cb(null, dirPath);
            },
            filename: (req, file, cb) => {
                let fileName = uniqueFileName(file.fieldname);
                fileName += path.extname(url.fileURLToPath(file.originalname));

                cb(null, fileName);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (mimeTypes.includes(file.mimetype) || mimeTypes.length === 0) {
                cb(null, true);
            } else {
                req.fileValidationError = 'Wrong file type!';
                return cb(null, false, req.fileValidationError);
            }
        },
        limits: { fieldSize: '50MB' }
    }).fields(fields);
}

const thumbnail = async (imagePath, destination, filename, width = 256, height = jimp.AUTO, n = 60) => {
    try {
        const image = await jimp.read(imagePath);
        image.resize(width, height); // resize the image. Jimp.AUTO can be passed as one of the values.
        image.quality(n); // set the quality of saved JPEG, 0 - 100

        let newImagePath = destination + '/thumb/';
        if (!fs.existsSync(newImagePath)) {
            fs.mkdirSync(newImagePath, { recursive: true }); // Create the directory recursively
        }
        newImagePath += filename;
        await image.writeAsync(newImagePath); // save to final destination path
        return newImagePath;
    } catch (error) {
        console.error({ error });
    }
}

export {
    upload,
    thumbnail
};
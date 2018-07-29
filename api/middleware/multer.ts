import multer from 'multer';

//Multer Commands Starts
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, (new Date().toISOString() + file.originalname).replace(/:/g, ''))
    }
});
const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg')
        cb(null, true);
    else
        cb(new Error("File type Error"), false);
}
const upload = multer({
    dest: './uploads',
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//Multer commands Ends

export default upload;

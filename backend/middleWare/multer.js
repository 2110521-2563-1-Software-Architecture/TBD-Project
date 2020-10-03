import multer from "multer";

var storage = multer.memoryStorage()

const upload = multer({storage});

export default upload;

// how to use 
// import upload from "../middleware/multer";
// router.post('/...' , upload.fields([
//     { name: 'media'},
//     { name: 'brochure' },
//     { name: 'floorplan' }
//   ]))
// can get file by 
// const newFile = req.files;
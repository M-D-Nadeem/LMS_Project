import multer from "multer";
import path from "path"
const upload = multer(
    { dest: 'uploads/',
    limits:{fieldSize:50*1024*1024}, //50mb file size
    storage : multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname)
        }
      }),   

fileFilter:(req,file,cb)=>{
    let ext=path.extname(file.originalname)

    if(
        ext!==".jpg"&&
        ext!==".jpeg"&&
        ext!==".webp"&&
        ext!==".png"&&
        ext!==".mp4"
    ){
        cb(new Error(`Unsupported file type ${ext}`),flase)
        return
    }
    cb(null, true)
}
})
export default upload
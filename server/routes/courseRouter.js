import express from "express"
import { createCourse, getAllCourses, getLecturesByCourseId } from "../controllers/courseController.js"
import upload from "../middleware/multerMiddleware.js"
const router=express.Router()

router.route("/")
.get(getAllCourses) //By this way we can give multiple methods(get,post,put..) in same route
router.post("/",upload.single("thumbnail") ,createCourse)
router.route('/:courseId').get(getLecturesByCourseId)

export default router
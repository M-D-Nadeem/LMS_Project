import express from "express"
import { addLectureToCourseById, createCourse, deleteCourse, deleteLectureToCourseById, getAllCourses, getLecturesByCourseId, updateCourse } from "../controllers/courseController.js"
import upload from "../middleware/multerMiddleware.js"
import { authorizedRoles, jwtAuth } from "../middleware/userMiddleware.js"

const router=express.Router()

//Before doing any operation 1st we have to cheak for login>>>This will be done by jwtAuth
//If it finds correct token given in the header then we can perform the operation
router.route("/")
.get(jwtAuth,getAllCourses) //By this way we can give multiple methods(get,post,put..) in same route

router.post("/create",jwtAuth,authorizedRoles("ADMIN"),upload.single("thumbnail") ,createCourse)

router.route('/:courseId')
.get(jwtAuth,getLecturesByCourseId)
.put(jwtAuth,authorizedRoles("ADMIN"),upload.single("thumbnail"),updateCourse)
.delete(jwtAuth,authorizedRoles("ADMIN"),deleteCourse)
.post(jwtAuth,authorizedRoles("ADMIN"),upload.single("lecture"),addLectureToCourseById)

router.route("/l/:courseId/:lectureId")
.delete(jwtAuth,authorizedRoles("ADMIN"),deleteLectureToCourseById)
export default router
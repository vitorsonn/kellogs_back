import express from 'express'
import categoryController from "../controllers/category.controller"
import { auth } from '../../middlewares/auth'

const router = express.Router()

router.post("/categories", auth,categoryController.create)
router.get("/categories",categoryController.list)
router.get("/categories/:id",categoryController.getById)
router.delete("/categories/:id",auth,categoryController.remove)
router.patch("/categories/:id",auth,categoryController.update)

export default router
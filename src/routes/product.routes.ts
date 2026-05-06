import express from 'express'
import productController from "../controllers/product.controller"
import { auth } from '../../middlewares/auth'

const router = express.Router()

router.post("/products",auth,productController.create)
router.get("/products",productController.list)
router.get("/products/:id",productController.getById)
router.patch("/products/:id",auth,productController.update)
router.delete("/products/:id",auth,productController.remove)

export default router
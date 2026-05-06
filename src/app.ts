import express from "express"
import cors from "cors"
import categoryRoutes from "./routes/category.routes.js"
import productRoutes from "./routes/product.routes.js"
import loginRoutes from "./routes/auth.routes.js"
import "dotenv/config"

const app = express()

app.use(cors())
app.use(express.json())
app.use(loginRoutes)
app.use(categoryRoutes)
app.use(productRoutes)

export default app
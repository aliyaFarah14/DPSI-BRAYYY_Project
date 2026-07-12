require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth")
const booksRoutes = require("./routes/books")
const loansRoutes = require("./routes/loans")
const returnsRoutes = require("./routes/returns")
const historyRoutes = require("./routes/history")
const publicRoutes = require("./routes/public")

const PORT = process.env.PORT || 3001

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))
app.use("/uploads", express.static("uploads"))

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/books/public", publicRoutes)
app.use("/api/v1/books", booksRoutes)
app.use("/api/v1/loans", loansRoutes)
app.use("/api/v1", returnsRoutes)
app.use("/api/v1/history", historyRoutes)

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

process.on("SIGINT", () => {
  console.log("\nShutting down...")
  server.close()
  process.exit(0)
})

process.on("SIGTERM", () => {
  server.close()
  process.exit(0)
})

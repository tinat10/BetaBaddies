import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

//init route goes here
//app.use("/init/endpoint/here", route)

app.use((req, res) => {
    res.status(404).json({error: "Not Found"})
})

export default app
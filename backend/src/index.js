import 'dotenv/config'
import {connectDB} from './db/index.js'
import app from './app.js'
connectDB()
.then( () => {
    app.listen(5000, () => {
        console.log("✅ Server running at port:", 5000)
    })

 }
)
.catch((error)=>{
    console.log(error)
})
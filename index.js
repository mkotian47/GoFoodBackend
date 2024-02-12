const express = require("express") ;
const mongoDB = require('./db')


const app = express();
const port = 5000;
mongoDB();
app.get('/',(req,res)=>{
    res.send('Hello World Mrunal Kotian');
})

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","http://localhost:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
})
app.use(express.json());
app.use('/api',require('./Routes/CreateUser'));
app.use('/api',require('./Routes/DisplayData'));
app.use('/api',require('./Routes/OrderData'));

app.listen(port,()=>{
    console.log(`The Server is Running on port ${port}`)
})
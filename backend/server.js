const express = require("express");
const cors = require("cors");
const PORT = 3000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());
//basic test route
app.get("/",(req,res)=>{
    res.json({message:"Memdev backend is running"});
});
//start server
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});
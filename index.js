const express = require('express')
const path = require('path')
const app = express()

app.listen(4000,()=>{
    console.log("App start")
})

app.get('/',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'tetris.html'))
})
const express = require('express')
const app = express()
const port = 3000


app.get('/', (req,res) => {
    res.send('<h1>한민욱 입니다.</h1>')
})

app.listen(port , () => {
    console.log(`Example app listening on port ${port}`)
})

// 포트란? 
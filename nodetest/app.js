const express = require('express')
const app = express()

// app.listen() 함수를 사용해서 서버를 실행
app.listen(9000, () => {
    // 9000번 포트로 웹 서버 실행
    console.log('Server started. port 9000.')
})

// 클라이언트에서 HTTP 요청 메소드 POST 방식으로 'host:3000/customer'를 호출했을 때
app.get('/', (req, res) => {
    res.send('get 요청에 대한 응답')
})
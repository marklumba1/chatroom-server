const express = require('express')
const app = express()
const PORT = 4000 || process.env.PORT

const cors = require('cors')
const http = require('http').Server(app)
app.use(cors())
const io = require('socket.io')(http, {
    cors: "http://localhost:3000"
})


let users = []
io.on('connection', (socket) => {

    console.log(socket.id + " is connected")

    socket.on("newUser", (user) => {
        users.push(user)
        io.emit("emitUsers", users)
        console.log(users)

    })

    socket.on('message', (data) => {
        io.emit('messageResponse', data)
        console.log(data)
    })

    socket.on('logout', (socketID) => {
        users = users.filter(user => user.socketID!=socketID)
        io.emit("emitUsers", users)
        console.log(socketID + 'logout')
    })

})


app.get('/api', (req, res) => {
    res.json({
        message: 'Hello World!'
    })
})

http.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`)
})
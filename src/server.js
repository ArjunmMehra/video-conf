const express = require('express')
const http = require('http')
const socket = require('socket.io')
const { v4: uuidv4 } = require('uuid')

const app = express()
const server = http.Server(app)
const io = socket(server)

const port = 3000

app.set("view engine", "ejs")

app.use(express.static("public"))

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
        socket.on("disconnect", () => {
            socket.to(roomId).broadcast.emit("user-disconnected", userId)
        })
    })

})



server.listen(port, () => {
    console.log("server listining at", port)
})
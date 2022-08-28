const io = require("socket.io")({
    cors: {
        origin:'*'
    }
})
const socketapi = {
    io: io
}

io.on('connection', function(socket){
    console.log("A user mtende patient systems connected", socket.id)

    socket.on('message', data=>{
        socket.broadcast.emit('message:received', data)
    })

    socket.on('disconnect', ()=>{
        console.log(`user ${socket.id} left`)
    })
})

module.exports = socketapi
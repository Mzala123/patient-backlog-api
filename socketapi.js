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
})

module.exports = socketapi
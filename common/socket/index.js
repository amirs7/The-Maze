const socketIO = require('socket.io');

const guardInterval = 3000;

class ClientManager {
  constructor(server) {
    this.io = socketIO(server);
    this.clients = {};
    this.setupGuard();
    this.setupHandlers();
  }

  setupGuard() {
    let clients = this.clients;
    this.gaurdId = setInterval(() => {
      for (let key in clients) {
        clients[key].sockets.forEach(s => {
          if (s !== clients[key].currentSocket)
            s.emit('salam', 'salam');
        });
      }
    }, guardInterval);
  }

  setupHandlers() {
    let clients = this.clients;
    this.io.on('connection', (socket) => {
      console.log('Socket connected');
      socket.on('username', (username) => {
        console.log(username, socket.id);
        if (!clients[username])
          clients[username] = { sockets: [] };
        clients[username].currentSocket = socket;
        clients[username].sockets.push(socket);
      });
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  }

  getSocket(id) {
    let clients = this.clients;
    for (let key in clients) {
      clients[key].sockets.forEach(s => {
        if (s.id === id)
          return s;
      });
    }
    return null;
  }

  removeSocket(id) {
    for (let key in clients) {
      let idx = clients[key].sockets.findIndex(s => {
        return s.id === id;
      });
      if (idx !== -1)
        clients[key].sockets.splice(idx, 1);
    }
  }
}

module.exports = ClientManager;

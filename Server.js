const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4000 });

let rooms = {}; // { roomId: { clients: [ws, ...], players: [{name, ws}], moves: [] } }
let roomCounter = 1;

function broadcast(roomId, data) {
  if (!rooms[roomId]) return;
  rooms[roomId].clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  });
}

wss.on('connection', function connection(ws) {
  let userRoom = null;

  ws.on('message', function incoming(message) {
    let data = {};
    try { data = JSON.parse(message); } catch { return; }

    if (data.type === 'createRoom') {
      const roomId = (roomCounter++).toString().padStart(4, '0');
      rooms[roomId] = { clients: [ws], players: [{name: data.username, ws}], moves: [] };
      userRoom = roomId;
      ws.send(JSON.stringify({ type: 'roomCreated', roomId }));
    } else if (data.type === 'joinRoom') {
      const { roomId, username } = data;
      if (!rooms[roomId]) {
        ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
        return;
      }
      if (rooms[roomId].players.length < 2) {
        rooms[roomId].players.push({ name: username, ws });
        rooms[roomId].clients.push(ws);
        userRoom = roomId;
        ws.send(JSON.stringify({ type: 'joinSuccess', roomId }));
      } else {
        // Spectator
        rooms[roomId].clients.push(ws);
        userRoom = roomId;
        ws.send(JSON.stringify({ type: 'spectateApproved', roomId }));
      }
    } else if (data.type === 'move') {
      // Broadcast moves to everyone in the room
      broadcast(data.roomId, {
        type: 'move',
        boardIndex: data.boardIndex,
        cellIndex: data.cellIndex,
        symbol: data.symbol
      });
    }
  });

  ws.on('close', () => {
    if (userRoom && rooms[userRoom]) {
      rooms[userRoom].clients = rooms[userRoom].clients.filter(c => c !== ws);
      rooms[userRoom].players = rooms[userRoom].players.filter(p => p.ws !== ws);
      if (rooms[userRoom].clients.length === 0) {
        delete rooms[userRoom];
      }
    }
  });
});

console.log('WebSocket server running on ws://localhost:4000');
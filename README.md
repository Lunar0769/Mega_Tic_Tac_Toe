# Mega Tic Tac Toe (Ultimate Tic Tac Toe)

A real-time multiplayer implementation of Ultimate Tic Tac Toe using React and WebSocket.

🎮 **[Play Live Demo](https://Lunar0769.github.io/Mega_Tic_Tac_Toe)**

## Game Rules

Ultimate Tic Tac Toe consists of 9 small tic-tac-toe boards arranged in a 3×3 grid:

1. **First Move**: Player X can choose any cell in any board
2. **Subsequent Moves**: Each move sends the opponent to the corresponding board (e.g., playing in position 5 of any board sends opponent to board 5)
3. **Completed Boards**: If sent to a completed (won or tied) board, player can choose any available board
4. **Winning**: Win by getting three sub-boards in a row to win the overall game

## Features

- ✅ **Real-time Multiplayer**: WebSocket-based synchronization
- ✅ **Turn-based Gameplay**: Only 2 players, strict turn validation
- ✅ **Visual Feedback**: Active boards highlighted, turn indicators
- ✅ **Room System**: Create and join rooms with unique IDs
- ✅ **Spectator Support**: Additional players can watch games
- ✅ **Win Detection**: Complete win logic for sub-boards and overall game
- ✅ **Responsive Design**: Works on desktop and mobile

## Quick Start (Local Development)

### 1. Clone and Install
```bash
git clone https://github.com/Lunar0769/Mega_Tic_Tac_Toe.git
cd Mega_Tic_Tac_Toe
npm install
cd server && npm install && cd ..
```

### 2. Start Server and Client
```bash
# Terminal 1: Start WebSocket server
cd server && npm start

# Terminal 2: Start React app
npm start
```

### 3. Play
- Open `http://localhost:3000`
- Create a room or join with a room ID
- Share the room ID with a friend to play!

## Deployment Guide

### Deploy Frontend to GitHub Pages

1. **Update package.json homepage**:
   ```json
   "homepage": "https://Lunar0769.github.io/Mega_Tic_Tac_Toe"
   ```

2. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

### Deploy Backend (WebSocket Server)

Choose one of these free hosting options:

#### Option 1: Railway
1. Create account at [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Deploy the `server` folder
4. Update WebSocket URL in `src/App.js`

#### Option 2: Render
1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo, set root directory to `server`
4. Set build command: `npm install`
5. Set start command: `npm start`

#### Option 3: Heroku
1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Deploy server folder
4. Update WebSocket URL

### Update WebSocket URL
After deploying your server, update the WebSocket URL in `src/App.js`:
```javascript
const { send } = useWebSocket(
  process.env.NODE_ENV === 'production' 
    ? 'wss://your-deployed-server.com' // Your actual server URL
    : 'ws://localhost:4000', 
  handleMessage
);
```

## Project Structure

```
├── src/
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Game logic utilities
│   ├── App.js              # Main app component
│   └── styles.css          # Global styles
├── server/
│   ├── server.js           # WebSocket server
│   └── package.json        # Server dependencies
├── public/                 # Static assets
└── package.json            # Client dependencies
```

## How to Play

1. **Create Room**: Enter your name and click "Create Room"
2. **Share Room ID**: Give the room ID to your opponent
3. **Join Room**: Your opponent enters the room ID and joins
4. **Play**: Take turns clicking cells in the active (highlighted) boards
5. **Win**: Get three sub-boards in a row to win!

## WebSocket API

### Client → Server Messages
- `createRoom`: Create a new game room
- `joinRoom`: Join existing room as player or spectator
- `move`: Make a move (validated server-side)

### Server → Client Messages
- `roomCreated`: Room creation confirmation with player symbol
- `joinSuccess`: Successfully joined as player
- `gameState`: Complete game state sync
- `move`: Opponent's validated move
- `gameEnd`: Game over with winner/tie result

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## License

MIT License - feel free to use this project for learning or building upon!

---

**Built with React, WebSocket, and ❤️**
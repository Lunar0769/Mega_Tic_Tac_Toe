# Mega Tic Tac Toe (Ultimate Tic Tac Toe)

**A real-time, multiplayer Ultimate Tic Tac Toe game using React and a Node.js WebSocket backend.**

## Features

- 3x3 grid of Tic Tac Toe boards (each 3x3)
- Real-time sync with WebSocket
- Active board and rules enforcement (Ultimate TTT rules)
- Win/tie detection for boards and meta-board
- Spectator support (basic)
- Simple UI and CSS

## Setup

1. **Install dependencies:**
    ```sh
    npm install
    ```

2. **Start the WebSocket server:**
    ```sh
    npm run server
    ```

3. **Start the React app:**
    ```sh
    npm start
    ```

4. Open [http://localhost:3000](http://localhost:3000) and play in multiple tabs!

---

## Directory Structure

```
mega-tic-tac-toe/
  server.js
  package.json
  src/
    index.js
    App.jsx
    styles.css
    utils/
      gameUtils.js
    components/
      Lobby.jsx
      GameBoard.jsx
      SubBoard.jsx
      Cell.jsx
```

---

## License

MIT
# Mega_Tic_Tac_Toe